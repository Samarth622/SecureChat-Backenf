import express from "express";
const router = express.Router();

import authMiddleware from "../../middlewares/auth.middleware.js";
import Message from "./message.model.js";

router.get("/messages/:userId", authMiddleware, async (req, res) => {
  const myId = req.user.userId;
  const otherUserId = req.params.userId;

  const messages = await Message.find({
    $or: [
      { senderId: myId, receiverId: otherUserId },
      { senderId: otherUserId, receiverId: myId },
    ],
  }).sort({ createdAt: 1 });

  res.json(messages);
});

export default router;