import { Server, Socket } from "socket.io";
import { ServerHandler } from "@/classes/serverHandler";
import { Cell } from "@/classes/game/cell";
import { World } from "@/classes/game/world";
import { Indices } from "@/classes/utils/indices";
import type { PlayerType } from "@/types/state.types";
import { settings } from "@/settings";
import type { TileType } from "@/types/world.types";
import { StateManager } from "@/manager/stateManager";

export const handleStart = (io: Server, socket: Socket) => {
  const gameStarts = async () => {
    const currentRoom: string = ServerHandler.getCurrentRoom(socket);

    StateManager.startGame(currentRoom);
    ServerHandler.sendMessageToEveryOne(io, socket, "game:starts", {});

    // initStorage(currentRoom);
    initPlayers(currentRoom);
    createWorld();
    placePlayers(currentRoom);
  };

  // const initStorage = (currentRoom: string) => {
  //   ServerHandler.sendMessageToEveryOne(
  //     io,
  //     socket,
  //     "game:initStorage",
  //     StateManager.getStorage(currentRoom)
  //   );
  // };

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

  const placePlayers = (currentRoom: string) => {
    const players: PlayerType = StateManager.getPlayers(currentRoom);

    Object.keys(players).forEach((id) => {
      const i = Math.floor(Math.random() * settings.mapSize);
      const j = Math.floor(Math.random() * settings.mapSize);
      const pos = new Indices(i, j);
      ServerHandler.sendPrivateMessage(io, id, "game:startPos", pos);
    });
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
