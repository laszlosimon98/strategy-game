import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { gameHandler } from "./handlers/gameHandler";

const PORT = 3000;

const app = express();
const httpServer = createServer(app);

const io: Server = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

const onConnecton = (socket: Socket) => {
  gameHandler(io, socket);
};

io.on("connection", onConnecton);

httpServer.listen(PORT, () => {
  console.log(`Game server is listening on port ${PORT}`);
});
