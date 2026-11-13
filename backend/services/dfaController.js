/**
 * DFA State Machine Controller Module
 * 
 * Formal Languages and Automata Theory (FLAT) Implementation
 * Deterministic Finite Automaton (DFA): M = (Q, Σ, δ, q0, F)
 * 
 * Q = { S0, S1, S2, S3 }
 *   S0: INPUT        - Initial state, waiting for user domain input
 *   S1: VALIDATION   - Lexical analysis & RFC domain regex validation
 *   S2: DNS_QUERY    - Operating system DNS stub resolver execution
 *   S3: RESULT       - Accepting state, output synthesis & telemetry
 * 
 * Σ = { SUBMIT_DOMAIN, SYNTAX_VALID, SYNTAX_INVALID, DNS_COMPLETE, DNS_ERROR, RESET }
 * 
 * Transition function δ:
 *   δ(S0, SUBMIT_DOMAIN)   = S1
 *   δ(S1, SYNTAX_VALID)    = S2
 *   δ(S1, SYNTAX_INVALID)  = S0
 *   δ(S2, DNS_COMPLETE)    = S3
 *   δ(S2, DNS_ERROR)       = S3  (DNS errors are valid lookup outcomes, not syntax errors)
 *   δ(S3, RESET)           = S0
 * 
 * q0 = S0
 * F  = { S3 }
 */

export const DFA_STATES = Object.freeze({
  S0: 'S0_INPUT',
  S1: 'S1_VALIDATION',
  S2: 'S2_DNS_QUERY',
  S3: 'S3_RESULT',
});

export const DFA_STATE_DETAILS = Object.freeze({
  [DFA_STATES.S0]: { code: 'S0', name: 'INPUT', label: 'S0 – INPUT', description: 'Awaiting user domain submission.' },
  [DFA_STATES.S1]: { code: 'S1', name: 'VALIDATION', label: 'S1 – VALIDATION', description: 'Executing RFC regex & syntax rule verification.' },
  [DFA_STATES.S2]: { code: 'S2', name: 'DNS_QUERY', label: 'S2 – DNS_QUERY', description: 'Concurrently querying OS DNS resolver for 6 RR types.' },
  [DFA_STATES.S3]: { code: 'S3', name: 'RESULT', label: 'S3 – RESULT', description: 'Lookup process completed (Accepting state).' },
});

export const DFA_ALPHABET = Object.freeze({
  SUBMIT_DOMAIN: 'SUBMIT_DOMAIN',
  SYNTAX_VALID: 'SYNTAX_VALID',
  SYNTAX_INVALID: 'SYNTAX_INVALID',
  DNS_COMPLETE: 'DNS_COMPLETE',
  DNS_ERROR: 'DNS_ERROR',
  RESET: 'RESET',
});

export const TRANSITION_TABLE = Object.freeze({
  [DFA_STATES.S0]: {
    [DFA_ALPHABET.SUBMIT_DOMAIN]: {
      nextState: DFA_STATES.S1,
      description: 'Domain submitted. Beginning formal lexical validation.',
    },
  },
  [DFA_STATES.S1]: {
    [DFA_ALPHABET.SYNTAX_VALID]: {
      nextState: DFA_STATES.S2,
      description: 'Domain syntax passed RFC 1035 & regex rules. Proceeding to DNS query.',
    },
    [DFA_ALPHABET.SYNTAX_INVALID]: {
      nextState: DFA_STATES.S0,
      description: 'Domain syntax failed validation. Returned to initial input state.',
    },
  },
  [DFA_STATES.S2]: {
    [DFA_ALPHABET.DNS_COMPLETE]: {
      nextState: DFA_STATES.S3,
      description: 'DNS queries resolved successfully across record types.',
    },
    [DFA_ALPHABET.DNS_ERROR]: {
      nextState: DFA_STATES.S3,
      description: 'DNS resolution completed with resolver errors (e.g. NXDOMAIN, SERVFAIL, timeout).',
    },
  },
  [DFA_STATES.S3]: {
    [DFA_ALPHABET.RESET]: {
      nextState: DFA_STATES.S0,
      description: 'Resetting state machine to initial input state for new lookup.',
    },
  },
});

export class DfaController {
  constructor(initialState = DFA_STATES.S0) {
    this.currentState = initialState;
    this.history = [];
    this.transitionCounter = 0;

    // Record initial state entry
    this._logHistory(null, this.currentState, 'INITIALIZE', 'DFA initialized at initial state S0.');
  }

  getCurrentState() {
    return {
      stateKey: this.currentState,
      ...DFA_STATE_DETAILS[this.currentState],
      isAccepting: this.currentState === DFA_STATES.S3,
    };
  }

  getHistory() {
    return [...this.history];
  }

  /**
   * Execute state transition δ(currentState, symbol)
   */
  transition(symbol, metadata = {}) {
    const validSymbols = Object.values(DFA_ALPHABET);
    if (!validSymbols.includes(symbol)) {
      const err = new Error(`Illegal alphabet symbol: "${symbol}". Symbol not in Σ.`);
      err.code = 'ERR_ILLEGAL_DFA_SYMBOL';
      throw err;
    }

    const stateTransitions = TRANSITION_TABLE[this.currentState];
    const transitionDef = stateTransitions ? stateTransitions[symbol] : null;

    if (!transitionDef) {
      const fromStateLabel = DFA_STATE_DETAILS[this.currentState]?.label || this.currentState;
      const err = new Error(`Illegal DFA transition: No transition defined for state ${fromStateLabel} on symbol "${symbol}".`);
      err.code = 'ERR_ILLEGAL_DFA_TRANSITION';
      err.currentState = this.currentState;
      err.symbol = symbol;
      throw err;
    }

    const fromState = this.currentState;
    const toState = transitionDef.nextState;
    this.currentState = toState;
    this.transitionCounter += 1;

    const entry = this._logHistory(fromState, toState, symbol, transitionDef.description, metadata);
    return entry;
  }

  reset() {
    if (this.currentState === DFA_STATES.S3) {
      return this.transition(DFA_ALPHABET.RESET);
    }
    // Force reset if needed
    const prev = this.currentState;
    this.currentState = DFA_STATES.S0;
    return this._logHistory(prev, DFA_STATES.S0, DFA_ALPHABET.RESET, 'Force reset to initial state S0.');
  }

  _logHistory(fromState, toState, symbol, description, metadata = {}) {
    const entry = {
      step: this.history.length + 1,
      fromState: fromState ? DFA_STATE_DETAILS[fromState]?.code || fromState : null,
      toState: DFA_STATE_DETAILS[toState]?.code || toState,
      fromStateLabel: fromState ? DFA_STATE_DETAILS[fromState]?.label || fromState : null,
      toStateLabel: DFA_STATE_DETAILS[toState]?.label || toState,
      symbol,
      description,
      timestamp: new Date().toISOString(),
      metadata,
    };
    this.history.push(entry);
    return entry;
  }

  static getFormalDefinition() {
    return {
      formalTuple: 'M = (Q, Σ, δ, q0, F)',
      states: DFA_STATE_DETAILS,
      alphabet: DFA_ALPHABET,
      initialState: DFA_STATES.S0,
      acceptingStates: [DFA_STATES.S3],
      transitions: TRANSITION_TABLE,
    };
  }
}
