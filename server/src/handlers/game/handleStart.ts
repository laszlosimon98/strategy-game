import { Server, Socket } from "socket.io";
import { Communicate } from "@/classes/communicate";
import { Cell } from "@/classes/game/cell";
import { World } from "@/classes/game/world";
import { Indices } from "@/classes/utils/indices";
import { PlayerType } from "@/types/state.types";
import { settings } from "@/settings";
import { TileType } from "@/types/world.types";
import { GameStateManager } from "@/manager/gameStateManager";

export const handleStart = (io: Server, socket: Socket) => {
  const gameStarts = async () => {
    const currentRoom: string = Communicate.getCurrentRoom(socket);

    GameStateManager.startGame(currentRoom);
    Communicate.sendMessageToEveryOne(io, socket, "game:starts", {});

    initPlayers(currentRoom);
    createWorld();
    placePlayers(currentRoom);
  };

  const initPlayers = (currentRoom: string) => {
    Communicate.sendMessageToEveryOne(
      io,
      socket,
      "game:initPlayers",
      GameStateManager.getPlayers(currentRoom)
    );
  };

  const createWorld = () => {
    const world: Cell[][] = World.createWorld();
    World.setWorld(world, socket);

    const tiles = getTiles(world);
    const obstacles = getObstacles(world);

    Communicate.sendMessageToEveryOne(io, socket, "game:createWorld", {
      tiles,
      obstacles,
    });
  };

  const placePlayers = (currentRoom: string) => {
    const players: PlayerType = GameStateManager.getPlayers(currentRoom);

    Object.keys(players).forEach((id) => {
      const i = Math.floor(Math.random() * settings.mapSize);
      const j = Math.floor(Math.random() * settings.mapSize);
      const pos = new Indices(i, j);
      Communicate.sendPrivateMessage(io, id, "game:startPos", pos);
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
