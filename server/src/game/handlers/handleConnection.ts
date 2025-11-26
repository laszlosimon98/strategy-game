import { Server, Socket } from "socket.io";

import { CommunicationHandler } from "@/communication/communicationHandler";
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

    const player = StateManager.getPlayer(room, socket);
    const uniqueName = player?.name || name;

    CommunicationHandler.sendMessageToSender(socket, "connect:code", {
      code: room,
    });
    CommunicationHandler.sendMessageToSender(socket, "connect:uniqueName", {
      name: uniqueName,
    });
    StateManager.newPlayerMessage(io, socket, room, uniqueName);
  };

  const joinGame = ({ code: room, name }: { code: string; name: string }) => {
    if (!StateManager.isRoomExists(room, io)) {
      CommunicationHandler.sendMessageToSender(
        socket,
        "connect:error",
        "Rossz csatlakozási kód!"
      );
      return;
    }

    if (StateManager.getRoomSize(room, io) >= settings.maxPlayer) {
      CommunicationHandler.sendMessageToSender(
        socket,
        "connect:error",
        "A váró megtelt!"
      );
      return;
    }

    if (StateManager.isGameStarted(room)) {
      CommunicationHandler.sendMessageToSender(
        socket,
        "connect:error",
        "Sikertelen csatlakozás. A játék elkezdődött!"
      );
      return;
    }

    StateManager.initPlayerInRoom(room, name, socket, false);

    socket.join(room);

    const player = StateManager.getPlayer(room, socket);
    const uniqueName = player?.name || name;

    CommunicationHandler.sendMessageToSender(socket, "connect:error", "");
    CommunicationHandler.sendMessageToSender(socket, "connect:code", {
      code: room,
    });
    CommunicationHandler.sendMessageToSender(socket, "connect:uniqueName", {
      name: uniqueName,
    });
    StateManager.newPlayerMessage(io, socket, room, uniqueName);
  };

  const disconnect = async () => {
    const room = CommunicationHandler.getCurrentRoom(socket);
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

    CommunicationHandler.sendMessageToEveryOne(io, socket, "game:playerLeft", {
      id: user.id,
      data: playerOldTerritory.map(formatCell),
    });

    const updatedCells: Cell[] = World.updateTerritory(socket);
    CommunicationHandler.sendMessageToEveryOne(
      io,
      socket,
      "game:updateTerritory",
      {
        data: updatedCells.map(formatCell),
      }
    );

    CommunicationHandler.sendMessageToEveryOneExceptSender(
      socket,
      "chat:message",
      {
        message: `${user.name} elhagyta a játékot!`,
        name: "Rendszer",
        color: "#000",
      }
    );

    console.log(StateManager.getRemainigPlayerCount(socket));

    if (StateManager.getRemainigPlayerCount(socket) === 1) {
      console.log(user.name + " lost");
      const lastUser = StateManager.getLastPlayer(socket);
      if (!lastUser) return;

      console.log(lastUser + " won");

      await StateManager.updateStatistic(user.name, "lose");
      await StateManager.updateStatistic(lastUser, "win");

      CommunicationHandler.sendMessageToEveryOne(io, socket, "chat:message", {
        message: `${lastUser} megnyerte a játékot!`,
        name: "Rendszer",
        color: "#000",
      });
    }

    if (StateManager.getRemainigPlayerCount(socket) > 1) {
      console.log(user.name + " lost");
      await StateManager.updateStatistic(user.name, "lose");
    }

    socket.leave(room);
  };

  const handleNewHost = (room: string) => {
    const players: PlayerType = StateManager.getPlayers(room);
    const playerKeys: string[] = Object.keys(players);

    if (playerKeys.length > 0) {
      const randomKey: string =
        playerKeys[Math.floor(Math.random() * playerKeys.length)];
      const newHost: string = players[randomKey].name;

      CommunicationHandler.sendMessageToEveryOne(
        io,
        socket,
        "connect:newHost",
        {
          name: newHost,
        }
      );
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
