import mongoose from 'mongoose';

const DfaTransitionSchema = new mongoose.Schema({
  step: { type: Number, required: true },
  fromState: { type: String, default: null },
  toState: { type: String, required: true },
  fromStateLabel: { type: String, default: null },
  toStateLabel: { type: String, default: null },
  symbol: { type: String, required: true },
  description: { type: String, default: '' },
  timestamp: { type: String, required: true },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { _id: false });

const LookupHistorySchema = new mongoose.Schema({
  domain: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    index: true,
  },
  isValidSyntax: {
    type: Boolean,
    required: true,
  },
  dnsStatus: {
    type: String,
    enum: ['SUCCESS', 'PARTIAL', 'NXDOMAIN', 'ERROR', 'NO_DATA', 'UNRESOLVED', 'SYNTAX_INVALID'],
    required: true,
  },
  statusMessage: {
    type: String,
    default: '',
  },
  records: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  unavailableRecords: {
    type: mongoose.Schema.Types.Mixed,
    default: [],
  },
  errorInfo: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  executionTimeMs: {
    type: Number,
    default: 0,
  },
  dfaTransitions: {
    type: [DfaTransitionSchema],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

export const LookupHistory = mongoose.model('LookupHistory', LookupHistorySchema);
