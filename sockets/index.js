import { Server } from "socket.io";
import { verifyToken } from "../utils/jwt.js";
import Message from "../modules/chat/message.model.js";

const onlineUsers = new Map();

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Unauthorized"));

      const decoded = verifyToken(token);
      socket.user = decoded;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user.userId;
    onlineUsers.set(userId, socket.id);

    console.log(`User connected: ${userId}`);

    socket.on("send_message", async (payload) => {
      const { receiverId, encryptedMessage, encryptedAESKey, iv, authTag } =
        payload;

      const message = await Message.create({
        senderId: userId,
        receiverId,
        encryptedMessage,
        encryptedAESKey,
        iv,
        authTag,
      });

      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        message.status = "delivered";
        message.deliveredAt = new Date();
        await message.save();
        io.to(receiverSocketId).emit("receive_message", {
          messageId: message._id,
          senderId: userId,
          encryptedMessage,
          encryptedAESKey,
          iv,
          authTag,
          createdAt: message.createdAt,
        });
      }
    });

    socket.on("message_read", async ({ messageId }) => {
      const message = await Message.findById(messageId);

      if (!message) return;

      if (String(message.receiverId) !== userId) return;

      message.status = "read";
      message.readAt = new Date();
      await message.save();

      const senderSocketId = onlineUsers.get(message.senderId.toString());

      if (senderSocketId) {
        io.to(senderSocketId).emit("message_read_receipt", {
          messageId: message._id,
          readAt: message.readAt,
        });
      }
    });

    socket.on("typing_start", ({ receiverId }) => {
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("typing_start", {
          senderId: userId,
        });
      }
    });

    socket.on("typing_stop", ({ receiverId }) => {
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("typing_stop", {
          senderId: userId,
        });
      }
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
      console.log(`User disconnected: ${userId}`);
    });
  });
};

export default setupSocket;
