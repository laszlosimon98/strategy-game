import { Server, Socket } from "socket.io";
import { Communicate } from "@/classes/communicate";
import { Cell } from "@/classes/game/cell";
import { World } from "@/classes/game/world";
import { Indices } from "@/classes/utils/indices";
import { state } from "@/data/state";
import { PlayerType, TileType } from "@/types/types";
import { settings } from "@/settings";

export const handleStart = (io: Server, socket: Socket) => {
  const getPlayers = (): PlayerType => {
    const currentRoom: string = Communicate.getCurrentRoom(socket);
    return state[currentRoom].players;
  };

  const gameStarts = async () => {
    const currentRoom: string = Communicate.getCurrentRoom(socket);
    state[currentRoom].isGameStarted = true;

    Communicate.sendMessageToEveryOne(io, socket, "game:starts", {});
    Communicate.sendMessageToEveryOne(
      io,
      socket,
      "game:initPlayers",
      getPlayers()
    );

    const world = createWorld();
    const tiles = getTiles(world);
    const obstacles = getObstacles(world);

    Communicate.sendMessageToEveryOne(io, socket, "game:createWorld", {
      tiles,
      obstacles,
    });

    const players: PlayerType = getPlayers();

    Object.keys(players).forEach((id) => {
      const i = Math.floor(Math.random() * settings.mapSize);
      const j = Math.floor(Math.random() * settings.mapSize);
      const pos = new Indices(i, j);
      Communicate.sendPrivateMessage(io, id, "game:startPos", pos);
    });
  };

  const createWorld = (): Cell[][] => {
    const world: Cell[][] = World.createWorld();
    World.setWorld(world, socket);

    return world;
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
