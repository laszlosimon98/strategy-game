import { v4 as uuidv4 } from "uuid";
import { Server, Socket } from "socket.io";
import { ServerHandler } from "@/server/serverHandler";
import { Cell } from "@/game/cell";
import { World } from "@/game/world";
import { Indices } from "@/utils/indices";
import type { EntityType, PlayerType } from "@/types/state.types";
import { settings } from "@/settings";
import type { TileType } from "@/types/world.types";
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
    const world: Cell[][] = World.createWorld();
    World.setWorld(world, socket);

    const tiles = getTiles(world);
    const obstacles = getObstacles(world);

    ServerHandler.sendMessageToEveryOne(io, socket, "game:createWorld", {
      tiles,
      obstacles,
    });
  };

  const initPlayersStartPosition = (currentRoom: string): void => {
    const players: PlayerType = StateManager.getPlayers(currentRoom);
    const startPositions: Indices[] = [...settings.startPositions];

    Object.keys(players).forEach((id) => {
      const idx: number = Math.floor(Math.random() * startPositions.length);
      const pos = startPositions.splice(idx, 1)[0];
      ServerHandler.sendPrivateMessage(io, id, "game:startPos", pos);

      placeTower(id, pos);
    });
  };

  const placeTower = (playerId: string, indices: Indices): void => {
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
    } else {
      ServerHandler.sendMessageToSender(socket, "game:error", response);
    }
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

  const getTiles = (world: Cell[][]): TileType[][] => {
    const tiles: TileType[][] = world.map((cells) =>
      cells.map((cell) => cell.getType())
    );

    return tiles;
  };

  const getObstacles = (world: Cell[][]): any => {
    const obstacles: any = world.map((cells) =>
      cells.map((cell) => cell.getObstacleType())
    );

    return obstacles;
  };

  socket.on("game:starts", gameStarts);
};
