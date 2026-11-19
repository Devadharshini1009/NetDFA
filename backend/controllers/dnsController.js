
import { validateDomain } from '../utils/domainValidator.js';
import {
  DfaController,
  DFA_ALPHABET,
  DFA_STATES,
} from '../services/dfaController.js';
import { queryDnsRecords } from '../services/dnsService.js';
import { verifyDomainRegistration } from '../services/domainRegistrationService.js';
import { LookupHistory } from '../models/LookupHistory.js';
import { getDbStatus } from '../config/db.js';

/**
 * Controller for DNS operations and State Machine workflow
 */

// POST /api/dns/lookup
export const lookupDomain = async (req, res, next) => {
  const dfa = new DfaController();

  try {
    const { domain } = req.body || {};

    // 1. S0 -> S1: User submits domain
    dfa.transition(DFA_ALPHABET.SUBMIT_DOMAIN, {
      rawInput: domain,
    });

    // 2. S1: Domain syntax validation
    const validation = validateDomain(domain);

    if (!validation.isValid) {
      dfa.transition(DFA_ALPHABET.SYNTAX_INVALID, {
        error: validation.error,
        code: validation.code,
      });

      return res.status(400).json({
        success: false,
        isValidSyntax: false,
        isRegistered: false,
        registrationStatus: 'NOT_CHECKED',
        domain: validation.normalizedDomain || domain || '',
        error: validation.error,
        code: validation.code,
        dfaTransitions: dfa.getHistory(),
        currentState: dfa.getCurrentState(),
      });
    }

    // 3. S1 -> S2: Syntax validation successful
    dfa.transition(DFA_ALPHABET.SYNTAX_VALID, {
      normalizedDomain: validation.normalizedDomain,
      labelsCount: validation.labels?.length,
      tld: validation.tld,
    });

    // 4. S2: Check domain registration using RDAP
    const registration = await verifyDomainRegistration(
      validation.normalizedDomain
    );

    // 5. Reject domain if registration is not found
    if (registration.registered === false) {
      dfa.transition(DFA_ALPHABET.DOMAIN_NOT_REGISTERED, {
        registrationStatus: registration.status,
      });

      return res.status(404).json({
        success: false,
        isValidSyntax: true,
        isRegistered: false,
        registrationStatus: registration.status,
        domain: validation.normalizedDomain,
        error: 'Domain Not Registered',
        message: registration.message,
        dfaTransitions: dfa.getHistory(),
        currentState: dfa.getCurrentState(),
      });
    }

    // 6. Stop if registration verification is unavailable
    if (
      registration.verified !== true ||
      registration.registered !== true
    ) {
      dfa.transition(DFA_ALPHABET.REGISTRATION_ERROR, {
        registrationStatus: registration.status,
      });

      return res.status(503).json({
        success: false,
        isValidSyntax: true,
        isRegistered: null,
        registrationStatus: registration.status,
        domain: validation.normalizedDomain,
        error: 'Registration Verification Unavailable',
        message: registration.message,
        dfaTransitions: dfa.getHistory(),
        currentState: dfa.getCurrentState(),
      });
    }

    // 7. S2 -> S3: Registration verified successfully
    dfa.transition(DFA_ALPHABET.DOMAIN_REGISTERED, {
      registrationStatus: registration.status,
    });

    // 8. S3: Execute existing DNS queries
    const dnsResult = await queryDnsRecords(
      validation.normalizedDomain
    );

    // 9. S3 -> S4: DNS lookup completed
    const isDnsError =
      dnsResult.status === 'NXDOMAIN' ||
      dnsResult.status === 'ERROR';

    const transitionSymbol = isDnsError
      ? DFA_ALPHABET.DNS_ERROR
      : DFA_ALPHABET.DNS_COMPLETE;

    dfa.transition(transitionSymbol, {
      dnsStatus: dnsResult.status,
      executionTimeMs: dnsResult.executionTimeMs,
      availableCount: Object.keys(dnsResult.records).length,
      unavailableCount: dnsResult.unavailableRecords.length,
    });

    // 10. Existing MongoDB history persistence
    let historySaved = false;
    let savedHistoryId = null;
    let dbWarning = null;

    const dbStatus = getDbStatus();

    if (dbStatus.connected) {
      try {
        const historyEntry = new LookupHistory({
          domain: validation.normalizedDomain,
          isValidSyntax: true,
          dnsStatus: dnsResult.status,
          statusMessage: dnsResult.statusMessage,
          records: dnsResult.records,
          unavailableRecords: dnsResult.unavailableRecords,
          errorInfo: dnsResult.errors,
          executionTimeMs: dnsResult.executionTimeMs,
          dfaTransitions: dfa.getHistory(),
        });

        const saved = await historyEntry.save();

        historySaved = true;
        savedHistoryId = saved._id;
      } catch (saveErr) {
        console.error(
          '[Database] Failed to persist lookup history:',
          saveErr.message
        );

        dbWarning = `Failed to save history: ${saveErr.message}`;
      }
    } else {
      dbWarning =
        'MongoDB is currently offline. Lookup completed successfully, but history was not saved to database.';
    }

    // 11. Return complete response
    return res.status(200).json({
      success: true,
      domain: validation.normalizedDomain,
      isValidSyntax: true,
      isRegistered: true,
      registrationStatus: registration.status,
      dnsStatus: dnsResult.status,
      statusMessage: dnsResult.statusMessage,
      records: dnsResult.records,
      unavailableRecords: dnsResult.unavailableRecords,
      executionTimeMs: dnsResult.executionTimeMs,
      resolver: dnsResult.resolver,
      queriedAt: dnsResult.queriedAt,
      dfaTransitions: dfa.getHistory(),
      currentState: dfa.getCurrentState(),
      historySaved,
      historyId: savedHistoryId,
      dbWarning,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/dns/history
export const getLookupHistory = async (req, res, next) => {
  try {
    const dbStatus = getDbStatus();

    if (!dbStatus.connected) {
      return res.status(503).json({
        success: false,
        error: 'Database Unavailable',
        message:
          'MongoDB is currently disconnected. Lookup history cannot be retrieved until database connection is restored.',
      });
    }

    const limit = Math.min(
      parseInt(req.query.limit, 10) || 50,
      100
    );

    const history = await LookupHistory.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return res.status(200).json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/dns/history/:id
export const getLookupHistoryById = async (req, res, next) => {
  try {
    const dbStatus = getDbStatus();

    if (!dbStatus.connected) {
      return res.status(503).json({
        success: false,
        error: 'Database Unavailable',
        message: 'MongoDB is currently disconnected.',
      });
    }

    const item = await LookupHistory.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Lookup history record with ID "${req.params.id}" not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      data: item,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/dns/history/:id
export const deleteLookupHistoryById = async (req, res, next) => {
  try {
    const dbStatus = getDbStatus();

    if (!dbStatus.connected) {
      return res.status(503).json({
        success: false,
        error: 'Database Unavailable',
        message:
          'MongoDB is currently disconnected. Cannot delete records while database is offline.',
      });
    }

    const deleted = await LookupHistory.findByIdAndDelete(
      req.params.id
    );

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Lookup history record with ID "${req.params.id}" not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Lookup history record for "${deleted.domain}" successfully deleted.`,
      deletedId: req.params.id,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/dns/dfa/definition
export const getDfaDefinition = (req, res) => {
  return res.status(200).json({
    success: true,
    data: DfaController.getFormalDefinition(),
  });
};

// GET /api/health
export const getHealth = (req, res) => {
  return res.status(200).json({
    status: 'OK',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    database: getDbStatus(),
    resolver:
      'Operating System configured resolver (Node.js node:dns/promises)',
    environment: process.env.NODE_ENV || 'development',
  });
};
