import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

const PORT = 3000;

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

io.on("connection", (socket: Socket) => {
  console.log(socket.id);

  socket.on("createGameServer", (data) => {
    console.log(data);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Game server is listening on port ${PORT}`);
});
