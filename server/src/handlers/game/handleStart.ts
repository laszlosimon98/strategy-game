import { v4 as uuidv4 } from "uuid";
import { Server, Socket } from "socket.io";
import { ServerHandler } from "@/server/serverHandler";
import { Cell } from "@/game/cell";
import { World } from "@/game/world";
import { Indices } from "@/utils/indices";
import type { EntityType, PlayerType } from "@/types/state.types";
import { settings } from "@/settings";
import type { Territory, TileType } from "@/types/world.types";
import { StateManager } from "@/manager/stateManager";
import { Building } from "@/game/building";
import { ReturnMessage } from "@/types/setting.types";
import { Position } from "@/types/utils.types";

export const handleStart = (io: Server, socket: Socket) => {
  const gameStarts = async () => {
    const currentRoom: string = ServerHandler.getCurrentRoom(socket);

    StateManager.startGame(currentRoom);
    ServerHandler.sendMessageToEveryOne(io, socket, "game:starts", {});

    initPlayers(currentRoom);
    createWorld();
    initPlayersStartPosition(currentRoom);
  };

  const initPlayers = (currentRoom: string) => {
    ServerHandler.sendMessageToEveryOne(
      io,
      socket,
      "game:initPlayers",
      StateManager.getPlayers(currentRoom)
    );
  };

  const createWorld = () => {
    World.createWorld(socket);

    ServerHandler.sendMessageToEveryOne(io, socket, "game:createWorld", {
      tiles: World.getTiles(socket),
      obstacles: World.getObstacles(socket),
    });
  };

  const initPlayersStartPosition = (currentRoom: string): void => {
    const players: PlayerType = StateManager.getPlayers(currentRoom);
    const startPositions: Indices[] = [...settings.startPositions];

    Object.keys(players).forEach((id) => {
      const idx: number = Math.floor(Math.random() * startPositions.length);
      const pos = startPositions.splice(idx, 1)[0];
      ServerHandler.sendPrivateMessage(io, id, "game:startPos", pos);

      const building: Building | null = placeTower(id, pos);

      if (building instanceof Building) {
        updateTerritory(building);
      }
    });
  };

  const placeTower = (playerId: string, indices: Indices): Building | null => {
    const entity: EntityType = {
      data: {
        id: uuidv4(),
        owner: playerId,
        url: `${settings.serverUrl}/assets/buildings/guardhouse.png`,
        static: "",
        indices,
        dimensions: {
          width: 128,
          height: 128,
        },
        position: calculateInitTowerPosition(indices),
        name: "guardhouse",
        productionTime: 0,
        cooldownTimer: 0,
        attackTimer: 0,
        healingTimer: 0,
        isProductionBuilding: false,
      },
    };

    const { i, j } = indices;
    StateManager.getWorld(socket)[i][j].setOwner(playerId);

    const response: Building | ReturnMessage = StateManager.createBuilding(
      socket,
      entity
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
      ServerHandler.sendMessageToSender(socket, "game:error", response);
      return null;
    }
  };

  const updateTerritory = (building: Building) => {
    const updatedCells: Territory[] | undefined = World.updateTerritory(
      socket,
      building
    );

    if (!updatedCells) return;

    ServerHandler.sendMessageToEveryOne(io, socket, "game:updateTerritory", {
      data: updatedCells,
    });
  };

  const calculateInitTowerPosition = (indices: Indices): Position => {
    const { i, j } = indices;

    const normalPos: Position = {
      x: i * settings.cellSize + settings.cellSize,
      y: j * settings.cellSize + settings.cellSize,
    };

    const isometricPos: Position = {
      x: normalPos.x - normalPos.y,
      y: (normalPos.x + normalPos.y) / 2,
    };

    return isometricPos;
  };

  socket.on("game:starts", gameStarts);
};
