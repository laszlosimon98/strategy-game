import { Server, Socket } from "socket.io";

import type {
  initialStateType,
  PlayerType,
  TeamType,
} from "../types/stateType";

const initialState: initialStateType = {
  data: {},
};

export const connectionHandler = (io: Server, socket: Socket) => {
  const generateCode = (): string => {
    let result = "";
    for (let i = 0; i < 6; ++i) {
      result += Math.floor(Math.random() * 10).toString();
    }
    return result;
  };

  const isRoomExists = (code: string): boolean => {
    return io.sockets.adapter.rooms.has(code);
  };

  const getRoomSize = (code: string): number => {
    return io.sockets.adapter.rooms.get(code)!.size;
  };

  const addPlayer = (code: string, player: PlayerType): void => {
    const newTeam: TeamType = {
      players: [],
    };

    if (!isRoomExists(code)) {
      initialState.data[code] = newTeam;
    }

    initialState.data[code].players.push(player);
  };

  const createGame = ({ name }: { name: string }) => {
    const code = generateCode();
    const newPlayer: PlayerType = {
      playerId: socket.id,
      name,
    };

    addPlayer(code, newPlayer);
    socket.join(code);
    socket.emit("connect:code", { code });
    newPlayerMessage(code, name);
  };

  const joinGame = ({ code, name }: { code: string; name: string }) => {
    if (!isRoomExists(code)) {
      socket.emit("connect:error:wrongCode", "Helytelen csatlakozási kód!");
      return;
    }

    if (getRoomSize(code) >= 4) {
      socket.emit("connect:error:roomIsFull", "A váró megtelt!");
      return;
    }

    const newPlayer: PlayerType = {
      playerId: socket.id,
      name,
    };

    addPlayer(code, newPlayer);
    socket.join(code);

    socket.emit("connect:code", { code });
    newPlayerMessage(code, name);
  };

  const disconnect = (code: string) => {
    const currentRoom = Array.from(socket.rooms)[1];

    if (currentRoom) {
      if (code !== "transport close") {
        socket.leave(currentRoom);
      }

      const user = initialState.data[currentRoom].players.find(
        (player) => player.playerId === socket.id
      );

      initialState.data[currentRoom].players = initialState.data[
        currentRoom
      ].players.filter((player) => player.playerId !== socket.id);

      playerleftMessage(currentRoom, user!.name);
    }
  };

  const newPlayerMessage = (code: string, name: string) => {
    io.to(code).emit("connect:newPlayer", `${name} csatlakozott a váróhoz!`);
  };

  const playerleftMessage = (code: string, name: string) => {
    io.to(code).emit("connect:playerLeft", `${name} elhagyta a várót!`);
  };

  socket.on("connect:create", createGame);
  socket.on("connect:join", joinGame);
  socket.on("connect:disconnect", disconnect);
  socket.on("disconnecting", disconnect);
};
