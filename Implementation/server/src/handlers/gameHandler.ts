import { Server, Socket } from "socket.io";

export const gameHandler = (io: Server, socket: Socket) => {
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

  const createGame = (payload: any) => {
    const code = generateCode();
    socket.join(code);
    socket.emit("game:created", { id: socket.id, code });
  };

  const joinGame = ({ code }: { code: string }) => {
    let status: string = "failed";

    if (isRoomExists(code)) {
      status = "success";
      socket.join(code);

      io.to(code).emit("game:newPlayer", {
        message: "New player has joined to party.",
      });

      socket.emit("game:code", { code });
    }

    socket.emit("game:joined", { id: socket.id, status });
  };

  socket.on("game:create", createGame);
  socket.on("game:join", joinGame);

  socket.on("game:test", ({ code, message }) => {
    console.log(code, message);
    io.to(code).emit("game:greetings", message);
  });
};
