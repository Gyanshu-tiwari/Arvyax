import express from 'express';
import {
  getPublicSessions,
  getMySessions,
  getSession,
  createSession,
  updateSession,
  deleteSession,
  publishSession,
  likeSession
} from '../controllers/sessionController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', optionalAuth, getPublicSessions);
router.get('/my-sessions', protect, getMySessions);
router.get('/:id', optionalAuth, getSession);

// Protected routes
router.post('/', protect, createSession);
router.put('/:id', protect, updateSession);
router.delete('/:id', protect, deleteSession);
router.put('/:id/publish', protect, publishSession);
router.put('/:id/like', protect, likeSession);

export default router; 