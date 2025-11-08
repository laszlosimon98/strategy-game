import { v4 as uuidv4 } from "uuid";
import { Server, Socket } from "socket.io";
import { ServerHandler } from "@/server/serverHandler";
import { World } from "@/game/world";
import { Indices } from "@/utils/indices";
import type { EntityType, PlayerType } from "@/types/state.types";
import { settings } from "@/settings";
import { StateManager } from "@/manager/stateManager";
import { Building } from "@/game/building";
import { ReturnMessage } from "@/types/setting.types";
import { Cell } from "@/game/cell";
import { calculatePositionFromIndices } from "@/utils/utils";

export const handleStart = (io: Server, socket: Socket) => {
  const gameStarts = async () => {
    const room: string = ServerHandler.getCurrentRoom(socket);
    if (!room) return;

    StateManager.startGame(room);
    ServerHandler.sendMessageToEveryOne(io, socket, "game:starts", {});

    initPlayers(room);
    createWorld();
    initPlayersStartPosition(room);
  };

  const initPlayers = (room: string) => {
    ServerHandler.sendMessageToEveryOne(
      io,
      socket,
      "game:initPlayers",
      StateManager.getPlayers(room)
    );
  };

  const createWorld = () => {
    const room: string = ServerHandler.getCurrentRoom(socket);
    if (!room) return;

    World.createWorld(socket);

    ServerHandler.sendMessageToEveryOne(io, socket, "game:createWorld", {
      tiles: World.getTiles(socket, room),
      obstacles: World.getObstacles(socket, room),
    });
  };

  const initPlayersStartPosition = (room: string): void => {
    const players: PlayerType = StateManager.getPlayers(room);
    const startPositions: Indices[] = [...settings.startPositions];

    Object.keys(players).forEach((id) => {
      const idx: number = Math.floor(Math.random() * startPositions.length);
      const pos = startPositions.splice(idx, 1)[0];
      ServerHandler.sendPrivateMessage(io, id, "game:startPos", pos);

      placeTower(id, pos);
      updateTerritory(id);
    });
  };

  const placeTower = (playerId: string, indices: Indices): Building | null => {
    const entity: EntityType = {
      data: {
        id: uuidv4(),
        owner: playerId,
        url: `${process.env.SERVER_URL}/assets/buildings/guardhouse.png`,
        static: "",
        indices,
        dimensions: {
          width: 128,
          height: 128,
        },
        position: calculatePositionFromIndices(indices),
        name: "guardhouse",
        productionTime: 0,
        cooldownTimer: 0,
        attackTimer: 0,
        healingTimer: 0,
        isProductionBuilding: false,
        facing: 0,
      },
    };

    const { i, j } = indices;
    const room: string = ServerHandler.getCurrentRoom(socket);
    if (!room) return null;

    StateManager.getWorld(room, socket)[i][j].setOwner(playerId);

    const response: Building | ReturnMessage = StateManager.createBuilding(
      socket,
      entity,
      false
    );

    if (response instanceof Building) {
      ServerHandler.sendMessageToEveryOne(
        io,
        socket,
        "game:build",
        response.getEntity()
      );
      return response;
    } else {
      ServerHandler.sendMessageToSender(socket, "game:info", response);
      return null;
    }
  };

  const updateTerritory = (id: string) => {
    const updatedCells: Cell[] = World.updateTerritory(socket);

    ServerHandler.sendMessageToEveryOne(io, socket, "game:updateTerritory", {
      data: updatedCells.map((cell) => {
        return {
          indices: cell.getIndices(),
          owner: cell.getOwner(),
          obstacle: cell.getHighestPriorityObstacleType(),
        };
      }),
    });
  };

  socket.on("game:starts", gameStarts);
};
