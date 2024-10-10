import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

import { authHandler } from "./handlers/authHandler";
import { connectionHandler } from "./handlers/connectionHandler";
import { gameHandler } from "./handlers/gameHandler";
import path from "path";
import { Loader } from "./classes/loader";

const PORT = 3000;

const app = express();
const httpServer = createServer(app);

app.use(express.static(path.join(__dirname, "..", "/public")));

const io: Server = new Server(httpServer, {
  cors: {
    // origin: "*",
    origin: ["http://localhost:5173", "http://192.168.1.70:5173"],
  },
});

const onConnecton = (socket: Socket) => {
  connectionHandler(io, socket);
  gameHandler(io, socket);
  // authHandler();
};

io.on("connection", onConnecton);

httpServer.listen(PORT, () => {
  console.log(`Game server is listening on port ${PORT}`);
});
