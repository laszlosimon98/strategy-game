import { Server, Socket } from "socket.io";

import { CONNECTION_CODE_LENGTH, MAX_PLAYER } from "../settings";
import { gameState, PlayerType, TeamType } from "../state/gameState";
import { Communicate } from "../classes/communicate";

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

  const isGameStarted = (code: string): boolean => {
    return gameState[code].isGameStarted;
  };

  const addPlayer = (code: string, player: PlayerType): void => {
    const newTeam: TeamType = {
      players: [],
      isGameStarted: false,
      world: [],
    };

    if (!isRoomExists(code)) {
      gameState[code] = newTeam;
    }

    gameState[code].players.push(player);
  };

  const createGame = ({ name }: { name: string }) => {
    const code = generateCode();
    const newPlayer: PlayerType = {
      playerId: socket.id,
      name,
    };

    addPlayer(code, newPlayer);
    socket.join(code);
    Communicate.sendMessageToSender(socket, "connect:code", { code });
    newPlayerMessage(code, name);
  };

  const joinGame = ({ code, name }: { code: string; name: string }) => {
    if (!isRoomExists(code)) {
      Communicate.sendMessageToSender(
        socket,
        "connect:error",
        "Rossz csatlakozási kód!"
      );
      return;
    }

    if (getRoomSize(code) >= MAX_PLAYER) {
      Communicate.sendMessageToSender(
        socket,
        "connect:error",
        "A váró megtelt!"
      );
      return;
    }

    if (isGameStarted(code)) {
      Communicate.sendMessageToSender(
        socket,
        "connect:error",
        "Sikertelen csatlakozás. A játék elkezdődött!"
      );
      return;
    }

    const newPlayer: PlayerType = {
      playerId: socket.id,
      name,
    };

    addPlayer(code, newPlayer);
    socket.join(code);

    Communicate.sendMessageToSender(socket, "connect:error", "");
    Communicate.sendMessageToSender(socket, "connect:code", { code });
    newPlayerMessage(code, name);
  };

  const disconnect = () => {
    const currentRoom = Communicate.getCurrentRoom(socket);

    if (currentRoom) {
      const user = gameState[currentRoom].players.find(
        (player) => player.playerId === socket.id
      );

      playerleftMessage(user!.name);

      gameState[currentRoom].players = gameState[currentRoom].players.filter(
        (player) => player.playerId !== socket.id
      );
    }
    socket.leave(currentRoom);
  };

  const newPlayerMessage = (code: string, name: string) => {
    Communicate.sendMessageToEveryOne(io, socket, "connect:newPlayer", {
      players: gameState[code].players,
      message: `${name} csatlakozott a váróhoz!`,
    });
  };

  const playerleftMessage = (name: string) => {
    Communicate.sendMessageToEveryOne(io, socket, "connect:playerLeft", {
      id: socket.id,
      message: `${name} elhagyta a várót!`,
    });
  };

  socket.on("connect:create", createGame);
  socket.on("connect:join", joinGame);
  socket.on("connect:disconnect", disconnect);
  socket.on("disconnecting", disconnect);
};
