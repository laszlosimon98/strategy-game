import { Server, Socket } from "socket.io";

type stateType = {
  players: Array<{ id: string; name: string; code: string }>;
};

const state: stateType = {
  players: [],
};

export const connectionHandler = (io: Server, socket: Socket) => {
  const generateCode = (): string => {
    let result = "";
    for (let i = 0; i < 1; ++i) {
      result += Math.floor(Math.random() * 10).toString();
    }
    return result;
  };

  const isRoomExists = (code: string): boolean => {
    return io.sockets.adapter.rooms.has(code);
  };

  const addPlayer = (code: string, name: string): void => {
    state.players.push({
      id: socket.id,
      name,
      code,
    });
  };

  const createGame = ({ name }: { name: string }) => {
    const code = "111";
    socket.join(code);

    addPlayer(code, name);

    socket.emit("connect:created", { id: socket.id, code });

    io.to(code).emit("connect:newPlayer", {
      id: socket.id,
      message: "New player",
    });
  };

  const joinGame = ({ code, name }: { code: string; name: string }) => {
    let status: string = "failed";

    if (isRoomExists(code)) {
      status = "success";
      socket.join(code);
      addPlayer(code, name);

      socket.emit("connect:code", { code });

      io.to(code).emit("connect:newPlayer", {
        id: socket.id,
        message: "New player",
      });
    }

    console.log(state);

    socket.emit("connect:joined", { id: socket.id, status });
  };

  const disconnect = (code: string) => {
    const user = state.players.find((player) => player.id === socket.id);
    state.players = state.players.filter((player) => player.id !== socket.id);
    console.log(state);

    if (user) {
      if (code !== "transport close") {
        socket.leave(code);
      }

      io.to(user!.code).emit(
        "connect:playerLeft",
        `${socket.id} player left the server`
      );
    }
  };

  socket.on("connect:create", createGame);
  socket.on("connect:join", joinGame);
  socket.on("connect:disconnect", disconnect);
  socket.on("disconnect", disconnect);
};
