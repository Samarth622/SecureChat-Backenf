import express from 'express';
const router = express.Router();

import authMiddleware from '../../middlewares/auth.middleware.js';


router.get("/me", authMiddleware, (req, res) => {
  return res.status(200).json({
    message: "Protected route accessed",
    user: req.user,
  });
});

export default router;