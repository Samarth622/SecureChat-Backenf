import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import http from "http";
import setupSocket from "./sockets/index.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 3000;

(async () => {
  await connectDB();

  const server = http.createServer(app);

  setupSocket(server);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})();
