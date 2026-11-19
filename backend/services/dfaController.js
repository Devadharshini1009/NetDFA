
/**
 * DFA State Machine Controller Module
 *
 * Formal Languages and Automata Theory (FLAT)
 * DFA: M = (Q, Σ, δ, q0, F)
 *
 * Q = { S0, S1, S2, S3, S4 }
 *
 * S0: INPUT
 * S1: VALIDATION
 * S2: REGISTRATION_CHECK
 * S3: DNS_QUERY
 * S4: RESULT
 *
 * Σ = {
 *   SUBMIT_DOMAIN,
 *   SYNTAX_VALID,
 *   SYNTAX_INVALID,
 *   DOMAIN_REGISTERED,
 *   DOMAIN_NOT_REGISTERED,
 *   REGISTRATION_ERROR,
 *   DNS_COMPLETE,
 *   DNS_ERROR,
 *   RESET
 * }
 *
 * q0 = S0
 * F  = { S4 }
 */

export const DFA_STATES = Object.freeze({
  S0: 'S0_INPUT',
  S1: 'S1_VALIDATION',
  S2: 'S2_REGISTRATION_CHECK',
  S3: 'S3_DNS_QUERY',
  S4: 'S4_RESULT',
});

export const DFA_STATE_DETAILS = Object.freeze({
  [DFA_STATES.S0]: {
    code: 'S0',
    name: 'INPUT',
    label: 'S0 – INPUT',
    description: 'Awaiting user domain submission.',
  },

  [DFA_STATES.S1]: {
    code: 'S1',
    name: 'VALIDATION',
    label: 'S1 – VALIDATION',
    description: 'Checking domain syntax and RFC validation rules.',
  },

  [DFA_STATES.S2]: {
    code: 'S2',
    name: 'REGISTRATION_CHECK',
    label: 'S2 – REGISTRATION CHECK',
    description: 'Verifying domain registration using RDAP.',
  },

  [DFA_STATES.S3]: {
    code: 'S3',
    name: 'DNS_QUERY',
    label: 'S3 – DNS QUERY',
    description: 'Querying OS DNS resolver for six DNS record types.',
  },

  [DFA_STATES.S4]: {
    code: 'S4',
    name: 'RESULT',
    label: 'S4 – RESULT',
    description: 'Lookup or verification process completed.',
  },
});

export const DFA_ALPHABET = Object.freeze({
  SUBMIT_DOMAIN: 'SUBMIT_DOMAIN',
  SYNTAX_VALID: 'SYNTAX_VALID',
  SYNTAX_INVALID: 'SYNTAX_INVALID',
  DOMAIN_REGISTERED: 'DOMAIN_REGISTERED',
  DOMAIN_NOT_REGISTERED: 'DOMAIN_NOT_REGISTERED',
  REGISTRATION_ERROR: 'REGISTRATION_ERROR',
  DNS_COMPLETE: 'DNS_COMPLETE',
  DNS_ERROR: 'DNS_ERROR',
  RESET: 'RESET',
});

export const TRANSITION_TABLE = Object.freeze({
  [DFA_STATES.S0]: {
    [DFA_ALPHABET.SUBMIT_DOMAIN]: {
      nextState: DFA_STATES.S1,
      description: 'Domain submitted. Beginning syntax validation.',
    },
  },

  [DFA_STATES.S1]: {
    [DFA_ALPHABET.SYNTAX_VALID]: {
      nextState: DFA_STATES.S2,
      description: 'Domain syntax is valid. Proceeding to registration verification.',
    },

    [DFA_ALPHABET.SYNTAX_INVALID]: {
      nextState: DFA_STATES.S4,
      description: 'Domain syntax validation failed. Lookup rejected.',
    },
  },

  [DFA_STATES.S2]: {
    [DFA_ALPHABET.DOMAIN_REGISTERED]: {
      nextState: DFA_STATES.S3,
      description: 'Domain registration verified. Proceeding to DNS query.',
    },

    [DFA_ALPHABET.DOMAIN_NOT_REGISTERED]: {
      nextState: DFA_STATES.S4,
      description: 'Domain registration not found. DNS query skipped.',
    },

    [DFA_ALPHABET.REGISTRATION_ERROR]: {
      nextState: DFA_STATES.S4,
      description: 'Registration verification unavailable. DNS query skipped.',
    },
  },

  [DFA_STATES.S3]: {
    [DFA_ALPHABET.DNS_COMPLETE]: {
      nextState: DFA_STATES.S4,
      description: 'DNS lookup completed successfully.',
    },

    [DFA_ALPHABET.DNS_ERROR]: {
      nextState: DFA_STATES.S4,
      description: 'DNS lookup completed with resolver errors.',
    },
  },

  [DFA_STATES.S4]: {
    [DFA_ALPHABET.RESET]: {
      nextState: DFA_STATES.S0,
      description: 'Resetting DFA to initial input state.',
    },
  },
});

export class DfaController {
  constructor(initialState = DFA_STATES.S0) {
    this.currentState = initialState;
    this.history = [];
    this.transitionCounter = 0;

    this._logHistory(
      null,
      this.currentState,
      'INITIALIZE',
      'DFA initialized at initial state S0.'
    );
  }

  getCurrentState() {
    return {
      stateKey: this.currentState,
      ...DFA_STATE_DETAILS[this.currentState],
      isAccepting: this.currentState === DFA_STATES.S4,
    };
  }

  getHistory() {
    return [...this.history];
  }

  /**
   * Execute δ(currentState, symbol)
   */
  transition(symbol, metadata = {}) {
    const validSymbols = Object.values(DFA_ALPHABET);

    if (!validSymbols.includes(symbol)) {
      const err = new Error(
        `Illegal alphabet symbol: "${symbol}". Symbol not in Σ.`
      );

      err.code = 'ERR_ILLEGAL_DFA_SYMBOL';
      throw err;
    }

    const stateTransitions = TRANSITION_TABLE[this.currentState];
    const transitionDef = stateTransitions
      ? stateTransitions[symbol]
      : null;

    if (!transitionDef) {
      const fromStateLabel =
        DFA_STATE_DETAILS[this.currentState]?.label ||
        this.currentState;

      const err = new Error(
        `Illegal DFA transition: No transition defined for state ${fromStateLabel} on symbol "${symbol}".`
      );

      err.code = 'ERR_ILLEGAL_DFA_TRANSITION';
      err.currentState = this.currentState;
      err.symbol = symbol;

      throw err;
    }

    const fromState = this.currentState;
    const toState = transitionDef.nextState;

    this.currentState = toState;
    this.transitionCounter += 1;

    return this._logHistory(
      fromState,
      toState,
      symbol,
      transitionDef.description,
      metadata
    );
  }

  reset() {
    if (this.currentState === DFA_STATES.S4) {
      return this.transition(DFA_ALPHABET.RESET);
    }

    const previousState = this.currentState;

    this.currentState = DFA_STATES.S0;

    return this._logHistory(
      previousState,
      DFA_STATES.S0,
      DFA_ALPHABET.RESET,
      'Force reset to initial state S0.'
    );
  }

  _logHistory(
    fromState,
    toState,
    symbol,
    description,
    metadata = {}
  ) {
    const entry = {
      step: this.history.length + 1,

      fromState: fromState
        ? DFA_STATE_DETAILS[fromState]?.code || fromState
        : null,

      toState:
        DFA_STATE_DETAILS[toState]?.code || toState,

      fromStateLabel: fromState
        ? DFA_STATE_DETAILS[fromState]?.label || fromState
        : null,

      toStateLabel:
        DFA_STATE_DETAILS[toState]?.label || toState,

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
      acceptingStates: [DFA_STATES.S4],
      transitions: TRANSITION_TABLE,
    };
  }
}
