import { Server, Socket } from "socket.io";

import type {
  initialStateType,
  PlayerType,
  TeamType,
} from "../types/stateType";
import { CONNECTION_CODE_LENGTH, MAX_PLAYER } from "../settings";

const initialState: initialStateType = {};

export const connectionHandler = (io: Server, socket: Socket) => {
  const generateCode = (): string => {
    let result = "";
    for (let i = 0; i < CONNECTION_CODE_LENGTH; ++i) {
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
      initialState[code] = newTeam;
    }

    initialState[code].players.push(player);
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

    if (getRoomSize(code) >= MAX_PLAYER) {
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
      const user = initialState[currentRoom].players.find(
        (player) => player.playerId === socket.id
      );

      playerleftMessage(currentRoom, user!.name);

      if (code !== "transport close") {
        socket.leave(currentRoom);
      }

      initialState[currentRoom].players = initialState[
        currentRoom
      ].players.filter((player) => player.playerId !== socket.id);
    }
  };

  const newPlayerMessage = (code: string, name: string) => {
    io.to(code).emit("connect:newPlayer", {
      players: initialState[code].players,
      message: `${name} csatlakozott a váróhoz!`,
    });
  };

  const playerleftMessage = (code: string, name: string) => {
    io.to(code).emit("connect:playerLeft", {
      id: socket.id,
      message: `${name} elhagyta a várót!`,
    });
  };

  socket.on("connect:create", createGame);
  socket.on("connect:join", joinGame);
  socket.on("connect:disconnect", disconnect);
  socket.on("disconnecting", disconnect);
};
