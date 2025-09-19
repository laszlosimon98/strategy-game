import { Server, Socket } from "socket.io";

import { ServerHandler } from "@/classes/serverHandler";
import { settings } from "@/settings";
import { StateManager } from "@/manager/stateManager";

export const connectionHandler = (io: Server, socket: Socket) => {
  const createGame = ({ name }: { name: string }) => {
    const room = StateManager.generateGameCode();

    StateManager.initRoom(room);
    StateManager.initPlayerInRoom(room, name, socket);

    socket.join(room);

    ServerHandler.sendMessageToSender(socket, "connect:code", { code: room });
    StateManager.newPlayerMessage(io, socket, room, name);
  };

  const joinGame = ({ code: room, name }: { code: string; name: string }) => {
    if (!StateManager.isRoomExists(room, io)) {
      ServerHandler.sendMessageToSender(
        socket,
        "connect:error",
        "Rossz csatlakozási kód!"
      );
      return;
    }

    if (StateManager.getRoomSize(room, io) >= settings.maxPlayer) {
      ServerHandler.sendMessageToSender(
        socket,
        "connect:error",
        "A váró megtelt!"
      );
      return;
    }

    if (StateManager.isGameStarted(room)) {
      ServerHandler.sendMessageToSender(
        socket,
        "connect:error",
        "Sikertelen csatlakozás. A játék elkezdődött!"
      );
      return;
    }

    StateManager.initPlayerInRoom(room, name, socket);

    socket.join(room);

    ServerHandler.sendMessageToSender(socket, "connect:error", "");
    ServerHandler.sendMessageToSender(socket, "connect:code", { code: room });
    StateManager.newPlayerMessage(io, socket, room, name);
  };

  const disconnect = () => {
    const room = ServerHandler.getCurrentRoom(socket);

    if (room) {
      const user = StateManager.getPlayer(room, socket);
      StateManager.restoreColor(room, user.color);
      StateManager.playerleftMessage(io, socket, user.name);
      StateManager.disconnectPlayer(room, socket);

      const isGameRoomEmpty: boolean = StateManager.isGameRoomEmpty(room);

      if (isGameRoomEmpty) {
        StateManager.deleteLobby(room);
      }
    }
    socket.leave(room);
  };

  socket.on("connect:create", createGame);
  socket.on("connect:join", joinGame);
  socket.on("connect:disconnect", disconnect);
  socket.on("disconnecting", disconnect);
};
