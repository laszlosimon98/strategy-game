import { Server, Socket } from "socket.io";

import { ServerHandler } from "@/classes/serverHandler";
import { settings } from "@/settings";
import { GameStateManager } from "@/manager/gameStateManager";

export const connectionHandler = (io: Server, socket: Socket) => {
  const createGame = ({ name }: { name: string }) => {
    const room = GameStateManager.generateGameCode();

    GameStateManager.initRoom(room);
    GameStateManager.initPlayerInRoom(room, name, socket);

    socket.join(room);

    ServerHandler.sendMessageToSender(socket, "connect:code", { code: room });
    GameStateManager.newPlayerMessage(io, socket, room, name);
  };

  const joinGame = ({ code: room, name }: { code: string; name: string }) => {
    if (!GameStateManager.isRoomExists(room, io)) {
      ServerHandler.sendMessageToSender(
        socket,
        "connect:error",
        "Rossz csatlakozási kód!"
      );
      return;
    }

    if (GameStateManager.getRoomSize(room, io) >= settings.maxPlayer) {
      ServerHandler.sendMessageToSender(
        socket,
        "connect:error",
        "A váró megtelt!"
      );
      return;
    }

    if (GameStateManager.isGameStarted(room)) {
      ServerHandler.sendMessageToSender(
        socket,
        "connect:error",
        "Sikertelen csatlakozás. A játék elkezdődött!"
      );
      return;
    }

    GameStateManager.initPlayerInRoom(room, name, socket);

    socket.join(room);

    ServerHandler.sendMessageToSender(socket, "connect:error", "");
    ServerHandler.sendMessageToSender(socket, "connect:code", { code: room });
    GameStateManager.newPlayerMessage(io, socket, room, name);
  };

  const disconnect = () => {
    const room = ServerHandler.getCurrentRoom(socket);

    if (room) {
      const user = GameStateManager.getPlayer(room, socket);
      GameStateManager.restoreColor(room, user.color);
      GameStateManager.playerleftMessage(io, socket, user.name);
      GameStateManager.disconnectPlayer(room, socket);

      const isGameRoomEmpty: boolean = GameStateManager.isGameRoomEmpty(room);

      if (isGameRoomEmpty) {
        GameStateManager.deleteLobby(room);
      }
    }
    socket.leave(room);
  };

  socket.on("connect:create", createGame);
  socket.on("connect:join", joinGame);
  socket.on("connect:disconnect", disconnect);
  socket.on("disconnecting", disconnect);
};
