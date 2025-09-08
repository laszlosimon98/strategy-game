import { Server, Socket } from "socket.io";

import { Communicate } from "@/classes/communicate";
import { state } from "@/data/state";
import { settings } from "@/settings";
import { ColorType } from "@/types/types";

export const connectionHandler = (io: Server, socket: Socket) => {
  const generateCode = (): string => {
    let result = "";
    for (let i = 0; i < settings.codeLength; ++i) {
      result += Math.floor(Math.random() * 10).toString();
    }
    return result;
  };

  const chooseColor = (colors: ColorType[]): ColorType => {
    const randomNumber = Math.floor(Math.random() * colors.length);

    const playerColor = colors[randomNumber];
    colors.splice(randomNumber, 1);
    return playerColor;
  };

  const isRoomExists = (code: string): boolean => {
    return io.sockets.adapter.rooms.has(code);
  };

  const getRoomSize = (code: string): number => {
    return io.sockets.adapter.rooms.get(code)!.size;
  };

  const isGameStarted = (code: string): boolean => {
    return state[code].isGameStarted;
  };

  const createGame = ({ name }: { name: string }) => {
    const code = generateCode();

    state[code] = {
      isGameStarted: false,
      players: {},
      world: [],
      remainingColors: [...settings.colors],
    };

    state[code].players[socket.id] = {
      name,
      color: chooseColor(state[code].remainingColors),
      buildings: [],
      units: [],
    };

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

    if (getRoomSize(code) >= settings.maxPlayer) {
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

    state[code].players[socket.id] = {
      name,
      color: chooseColor(state[code].remainingColors),
      buildings: [],
      units: [],
    };

    socket.join(code);

    Communicate.sendMessageToSender(socket, "connect:error", "");
    Communicate.sendMessageToSender(socket, "connect:code", { code });
    newPlayerMessage(code, name);
  };

  const disconnect = () => {
    const currentRoom = Communicate.getCurrentRoom(socket);

    if (currentRoom) {
      const user = state[currentRoom].players[socket.id];
      state[currentRoom].remainingColors.push(user.color);
      playerleftMessage(user.name);
      delete state[currentRoom].players[socket.id];
    }
    socket.leave(currentRoom);
  };

  const newPlayerMessage = (code: string, name: string) => {
    const names = getPlayerNames(code);
    Communicate.sendMessageToEveryOne(io, socket, "connect:newPlayer", {
      players: names,
      message: `${name} csatlakozott a váróhoz!`,
    });
  };

  const playerleftMessage = (name: string) => {
    Communicate.sendMessageToEveryOne(io, socket, "connect:playerLeft", {
      name,
      message: `${name} elhagyta a várót!`,
    });
  };

  const getPlayerNames = (code: string): string[] => {
    const result: string[] = [];
    Object.keys(state[code].players).forEach((id) => {
      result.push(state[code].players[id].name);
    });

    return result;
  };

  socket.on("connect:create", createGame);
  socket.on("connect:join", joinGame);
  socket.on("connect:disconnect", disconnect);
  socket.on("disconnecting", disconnect);
};
