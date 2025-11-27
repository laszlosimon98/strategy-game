import { Server, Socket } from "socket.io";

import { CommunicationHandler } from "@/communication/communicationHandler";
import { settings } from "@/settings";
import { StateManager } from "@/manager/stateManager";
import { World } from "@/game/world";
import { Cell } from "@/game/cell";
import { PlayerType } from "@/types/state.types";

/**
 * Kezeli a játék létrehozást, csatlakozást, hibaüzeneteket és a kliens lecsatlakozását
 * @param io Socket.IO szerver
 * @param socket csatlakozott kliens
 */
export const handleConnection = (io: Server, socket: Socket): void => {
  /**
   * Inicializálja a szobát és hozzáadja a játékost
   * @param param0 játékos neve
   */
  const createGame = ({ name }: { name: string }): void => {
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

  /**
   * Kezeli a játék csatlakozását a megadott azonsoítójú szobához.
   * Hibaüzenetet dob,
   *  - ha nem létezik az azonsítóval ellátott szoba
   *  - ha megtelt a létszám
   *  - ha elindult a játék
   * @param param0 csatlakozási kód és a csatlakozó játékos neve
   * @returns
   */
  const joinGame = ({
    code: room,
    name,
  }: {
    code: string;
    name: string;
  }): void => {
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

  /**
   * Kezeli a kliens lecsatlakozását
   * @returns
   */
  const disconnect = async (): Promise<void> => {
    const room = CommunicationHandler.getCurrentRoom(socket);
    if (!room) return;

    const user: PlayerType[""] | undefined = StateManager.getPlayer(
      room,
      socket
    );
    if (!user) return;

    const playerOldTerritory: Cell[] = World.updateTerritory(socket, {
      id: user.id,
    });
    World.cleanupPlayerTerritory(socket, user.id);

    if (StateManager.isGameStarted(room)) {
      handleStatisticUpdate(user);
    }

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

    if (StateManager.isGameStarted(room)) {
      CommunicationHandler.sendMessageToEveryOne(
        io,
        socket,
        "game:playerLeft",
        {
          id: user.id,
          data: playerOldTerritory.map(formatCell),
        }
      );

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
    }

    socket.leave(room);
  };

  /**
   * Statisztika frissítés
   * @param user játékos
   * @returns
   */
  const handleStatisticUpdate = async (user: PlayerType[""]): Promise<void> => {
    if (user.isStatisticUpdated) {
      return;
    }

    if (StateManager.getRemainigPlayerCount(socket) === 1) {
      await StateManager.updateStatistic(user.name, "win");
    } else {
      await StateManager.updateStatistic(user.name, "lose");
    }
  };

  /**
   * Kezeli a váróban az új host kiválasztását
   * @param room szoba azonosító
   */
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
