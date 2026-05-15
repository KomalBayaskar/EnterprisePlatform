import express from 'express';
import { login } from '../controllers/auth.controller.js';
import { getUsers, createUser, updateUser, deleteUser } from '../controllers/user.controller.js';
import { getOverview, getUsageTrends } from '../controllers/analytics.controller.js';
import { getAiHistory, getAiUsageChart, chatWithAi } from '../controllers/ai.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Auth
router.post('/auth/login', login);

// Users
router.get('/users', authenticateToken, getUsers);
router.post('/users', authenticateToken, createUser);
router.put('/users/:id', authenticateToken, updateUser);
router.delete('/users/:id', authenticateToken, deleteUser);

// Analytics
router.get('/analytics/overview', authenticateToken, getOverview);
router.get('/analytics/usage', authenticateToken, getUsageTrends);

// AI
router.get('/ai/history', authenticateToken, getAiHistory);
router.get('/ai/usage', authenticateToken, getAiUsageChart);
router.post('/ai/chat', authenticateToken, chatWithAi);

export default router;
