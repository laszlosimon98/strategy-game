import { Server, Socket } from "socket.io";

import { ServerHandler } from "@/server/serverHandler";
import { settings } from "@/settings";
import { StateManager } from "@/manager/stateManager";
import { World } from "@/game/world";
import { Cell } from "@/game/cell";
import { PlayerType } from "@/types/state.types";

export const handleConnection = (io: Server, socket: Socket) => {
  const createGame = ({ name }: { name: string }) => {
    const room = StateManager.generateGameCode();

    StateManager.initRoom(room);
    StateManager.initPlayerInRoom(room, name, socket, true);

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

    StateManager.initPlayerInRoom(room, name, socket, false);

    socket.join(room);

    ServerHandler.sendMessageToSender(socket, "connect:error", "");
    ServerHandler.sendMessageToSender(socket, "connect:code", { code: room });
    StateManager.newPlayerMessage(io, socket, room, name);
  };

  const disconnect = () => {
    const room = ServerHandler.getCurrentRoom(socket);
    if (!room) return;

    const user = StateManager.getPlayer(room, socket);
    if (!user) return;

    const playerOldTerritory: Cell[] = World.updateTerritory(socket, {
      id: user.id,
    });
    World.cleanupPlayerTerritory(socket, user.id);

    StateManager.handlePlayerDisconnect(socket, room, user.color);
    StateManager.playerleftMessage(io, socket, user.name);

    const isGameRoomEmpty: boolean = StateManager.isGameRoomEmpty(room);

    if (isGameRoomEmpty) {
      StateManager.deleteLobby(room);
      socket.leave(room);
      return;
    }

    if (user.isHost) {
      handleNewHost(room);
    }

    ServerHandler.sendMessageToEveryOne(io, socket, "game:playerLeft", {
      id: user.id,
      data: playerOldTerritory.map(formatCell),
    });

    const updatedCells: Cell[] = World.updateTerritory(socket);
    ServerHandler.sendMessageToEveryOne(io, socket, "game:updateTerritory", {
      data: updatedCells.map(formatCell),
    });
  };

  const handleNewHost = (room: string) => {
    const players: PlayerType = StateManager.getPlayers(room);
    const playerKeys: string[] = Object.keys(players);

    if (playerKeys.length > 0) {
      const randomKey: string =
        playerKeys[Math.floor(Math.random() * playerKeys.length)];
      const newHost: string = players[randomKey].name;

      ServerHandler.sendMessageToEveryOne(io, socket, "connect:newHost", {
        name: newHost,
      });
    }
  };

  const formatCell = (cell: Cell) => ({
    indices: cell.getIndices(),
    owner: cell.getOwner(),
    obstacle: cell.getHighestPriorityObstacleType(),
  });

  socket.on("connect:create", createGame);
  socket.on("connect:join", joinGame);
  socket.on("connect:disconnect", disconnect);
  socket.on("disconnecting", disconnect);
};
