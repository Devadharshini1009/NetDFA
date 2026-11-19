
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  DfaController,
  DFA_STATES,
  DFA_ALPHABET,
} from '../services/dfaController.js';

// Test 1: Complete registered-domain lifecycle
test('DFA Controller - Registered domain lifecycle S0 -> S1 -> S2 -> S3 -> S4 -> S0', () => {
  const dfa = new DfaController();

  assert.equal(dfa.getCurrentState().stateKey, DFA_STATES.S0);

  // S0 -> S1: Submit domain
  dfa.transition(DFA_ALPHABET.SUBMIT_DOMAIN, {
    domain: 'google.com',
  });

  assert.equal(dfa.getCurrentState().stateKey, DFA_STATES.S1);

  // S1 -> S2: Syntax valid
  dfa.transition(DFA_ALPHABET.SYNTAX_VALID);

  assert.equal(dfa.getCurrentState().stateKey, DFA_STATES.S2);

  // S2 -> S3: Domain registered
  dfa.transition(DFA_ALPHABET.DOMAIN_REGISTERED);

  assert.equal(dfa.getCurrentState().stateKey, DFA_STATES.S3);

  // S3 -> S4: DNS completed
  dfa.transition(DFA_ALPHABET.DNS_COMPLETE);

  assert.equal(dfa.getCurrentState().stateKey, DFA_STATES.S4);
  assert.equal(dfa.getCurrentState().isAccepting, true);

  // S4 -> S0: Reset
  dfa.transition(DFA_ALPHABET.RESET);

  assert.equal(dfa.getCurrentState().stateKey, DFA_STATES.S0);

  const history = dfa.getHistory();

  assert.equal(history.length, 6);
});

// Test 2: Invalid syntax
test('DFA Controller - Syntax failure path S0 -> S1 -> S4', () => {
  const dfa = new DfaController();

  dfa.transition(DFA_ALPHABET.SUBMIT_DOMAIN, {
    domain: 'google..com',
  });

  assert.equal(dfa.getCurrentState().stateKey, DFA_STATES.S1);

  dfa.transition(DFA_ALPHABET.SYNTAX_INVALID, {
    error: 'Consecutive dots',
  });

  assert.equal(dfa.getCurrentState().stateKey, DFA_STATES.S4);
  assert.equal(dfa.getCurrentState().isAccepting, true);
});

// Test 3: Domain not registered
test('DFA Controller - Unregistered domain path S0 -> S1 -> S2 -> S4', () => {
  const dfa = new DfaController();

  dfa.transition(DFA_ALPHABET.SUBMIT_DOMAIN);
  dfa.transition(DFA_ALPHABET.SYNTAX_VALID);

  dfa.transition(DFA_ALPHABET.DOMAIN_NOT_REGISTERED);

  assert.equal(dfa.getCurrentState().stateKey, DFA_STATES.S4);
  assert.equal(dfa.getCurrentState().isAccepting, true);
});

// Test 4: Registration verification unavailable
test('DFA Controller - Registration verification error', () => {
  const dfa = new DfaController();

  dfa.transition(DFA_ALPHABET.SUBMIT_DOMAIN);
  dfa.transition(DFA_ALPHABET.SYNTAX_VALID);

  dfa.transition(DFA_ALPHABET.REGISTRATION_ERROR);

  assert.equal(dfa.getCurrentState().stateKey, DFA_STATES.S4);
  assert.equal(dfa.getCurrentState().isAccepting, true);
});

// Test 5: DNS error after registration
test('DFA Controller - DNS Error transitions to S4 Result', () => {
  const dfa = new DfaController();

  dfa.transition(DFA_ALPHABET.SUBMIT_DOMAIN);
  dfa.transition(DFA_ALPHABET.SYNTAX_VALID);
  dfa.transition(DFA_ALPHABET.DOMAIN_REGISTERED);

  dfa.transition(DFA_ALPHABET.DNS_ERROR, {
    reason: 'NXDOMAIN',
  });

  assert.equal(dfa.getCurrentState().stateKey, DFA_STATES.S4);
  assert.equal(dfa.getCurrentState().isAccepting, true);
});

// Test 6: Reject illegal transitions
test('DFA Controller - Rejection of illegal transitions', () => {
  const dfa = new DfaController();

  // Illegal: S0 -> SYNTAX_VALID
  assert.throws(() => {
    dfa.transition(DFA_ALPHABET.SYNTAX_VALID);
  }, /Illegal DFA transition/);

  // Illegal: S0 -> DNS_COMPLETE
  assert.throws(() => {
    dfa.transition(DFA_ALPHABET.DNS_COMPLETE);
  }, /Illegal DFA transition/);

  // Illegal alphabet symbol
  assert.throws(() => {
    dfa.transition('NON_EXISTENT_SYMBOL');
  }, /Illegal alphabet symbol/);
});
