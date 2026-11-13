import test from 'node:test';
import assert from 'node:assert/strict';
import { DfaController, DFA_STATES, DFA_ALPHABET } from '../services/dfaController.js';

test('DFA Controller - Happy path transition lifecycle S0 -> S1 -> S2 -> S3 -> S0', () => {
  const dfa = new DfaController();
  assert.equal(dfa.getCurrentState().stateKey, DFA_STATES.S0);

  // S0 -> S1
  dfa.transition(DFA_ALPHABET.SUBMIT_DOMAIN, { domain: 'google.com' });
  assert.equal(dfa.getCurrentState().stateKey, DFA_STATES.S1);

  // S1 -> S2
  dfa.transition(DFA_ALPHABET.SYNTAX_VALID);
  assert.equal(dfa.getCurrentState().stateKey, DFA_STATES.S2);

  // S2 -> S3 (accepting)
  dfa.transition(DFA_ALPHABET.DNS_COMPLETE);
  assert.equal(dfa.getCurrentState().stateKey, DFA_STATES.S3);
  assert.equal(dfa.getCurrentState().isAccepting, true);

  // S3 -> S0
  dfa.transition(DFA_ALPHABET.RESET);
  assert.equal(dfa.getCurrentState().stateKey, DFA_STATES.S0);

  const history = dfa.getHistory();
  assert.equal(history.length, 5); // 1 init + 4 transitions
});

test('DFA Controller - Validation failure path S0 -> S1 -> S0', () => {
  const dfa = new DfaController();
  dfa.transition(DFA_ALPHABET.SUBMIT_DOMAIN, { domain: 'google..com' });
  assert.equal(dfa.getCurrentState().stateKey, DFA_STATES.S1);

  dfa.transition(DFA_ALPHABET.SYNTAX_INVALID, { error: 'Consecutive dots' });
  assert.equal(dfa.getCurrentState().stateKey, DFA_STATES.S0);
});

test('DFA Controller - DNS Error transitions to S3 (Result)', () => {
  const dfa = new DfaController();
  dfa.transition(DFA_ALPHABET.SUBMIT_DOMAIN);
  dfa.transition(DFA_ALPHABET.SYNTAX_VALID);
  dfa.transition(DFA_ALPHABET.DNS_ERROR, { reason: 'NXDOMAIN' });
  assert.equal(dfa.getCurrentState().stateKey, DFA_STATES.S3);
  assert.equal(dfa.getCurrentState().isAccepting, true);
});

test('DFA Controller - Rejection of illegal transitions', () => {
  const dfa = new DfaController(); // S0

  // Illegal: S0 -> SYNTAX_VALID
  assert.throws(() => {
    dfa.transition(DFA_ALPHABET.SYNTAX_VALID);
  }, /Illegal DFA transition/);

  // Illegal: S0 -> DNS_COMPLETE
  assert.throws(() => {
    dfa.transition(DFA_ALPHABET.DNS_COMPLETE);
  }, /Illegal DFA transition/);

  // Illegal symbol
  assert.throws(() => {
    dfa.transition('NON_EXISTENT_SYMBOL');
  }, /Illegal alphabet symbol/);
});
