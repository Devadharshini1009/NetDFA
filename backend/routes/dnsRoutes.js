import { Router } from 'express';
import {
  lookupDomain,
  getLookupHistory,
  getLookupHistoryById,
  deleteLookupHistoryById,
  getDfaDefinition,
} from '../controllers/dnsController.js';

const router = Router();

// Core DNS Lookup route
router.post('/lookup', lookupDomain);

// History routes
router.get('/history', getLookupHistory);
router.get('/history/:id', getLookupHistoryById);
router.delete('/history/:id', deleteLookupHistoryById);

// DFA formal definition route
router.get('/dfa/definition', getDfaDefinition);

export default router;
