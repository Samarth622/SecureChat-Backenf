import express from "express";
import helmet from "helmet";
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/users/user.routes.js";
import chatRoutes from "./modules/chat/chat.routes.js";

const app = express();

app.use(helmet());

app.use(express.json());

app.use("/auth", authRoutes);

app.use("/users", userRoutes);

app.use("/chat", chatRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

export default app;
