import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const port = 3000;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

let users: { id: string; symbol: string }[] = [];

io.on("connection", (socket) => {
  socket.on("connectPlayer", (id) => {
    console.log(`User ${socket.id} connected to game`);
    const user = {
      id: id,
      symbol: users.length === 0 ? "X" : "O",
      isMyTurn: users.length === 0,
    };

    users.push(user);
    socket.join("room1");

    if (users.length === 2) {
      io.to("room1").emit("gameStarts", users); // mindenkinek az adott roomban
      // socket.to("room1").emit("gameStarts", {});             // csak annak aki kuldte az adott roomban
      // socket.broadcast.to("room1").emit("gameStarts", {});   // mindenkinek kiveve aki kuldte az adott roomban
    }
  });

  socket.on("makeMove", ({ id, board }) => {
    users = users.map((user) => ({
      ...user,
      isMyTurn: user.id !== id,
    }));
    io.to("room1").emit("makeMoveResponse", { board, users });
  });

  socket.on("winner", (id) => {
    const winner = users.find((user) => user.id === id);
    socket.broadcast.to("room1").emit("winner", winner);
  });

  socket.on("restart", () => {
    users = [];
    io.to("room1").emit("restart");
  });

  socket.on("disconnect", () => {
    leavePlayer(socket.id);
    socket.broadcast.to("room1").emit("playerLeaves", {});
  });
});

const leavePlayer = (id: string) => {
  users = users.filter((user) => user.id !== id);
};

httpServer.listen(port, () =>
  console.log(`Game server is listening on port ${port}`)
);
