import express from 'express';
const router = express.Router();

import { registerUser, loginUser } from './auth.controller.js';
import { loginRateLimiter } from '../../middlewares/rateLimit.middleware.js';

router.post('/register', registerUser);
router.post('/login', loginRateLimiter, loginUser);

export default router;