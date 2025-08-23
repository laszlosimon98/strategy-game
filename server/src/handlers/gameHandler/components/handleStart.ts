import { Server, Socket } from "socket.io";
import { Communicate } from "../../../classes/communicate";
import { Cell } from "../../../classes/game/cell";
import { World } from "../../../classes/game/world";
import { Indices } from "../../../classes/utils/indices";
import { state } from "../../../data/state";
import { START_POSITIONS } from "../../../settings";
import { PlayerType, TileType } from "../../../types/types";
import path from "path";
import { Loader } from "../../../classes/imageLoader";

export const handleStart = (io: Server, socket: Socket) => {
  /**
   *
   * @returns Visszatér a szobában lévő játékosokkal
   */
  const getPlayers = (): PlayerType => {
    const currentRoom: string = Communicate.getCurrentRoom(socket);
    return state[currentRoom].players;
  };

  /**
   * Létrehozza a világot,
   * üzeneteket küld a klienseknek,
   * meghatározza a kezdő koordinátákat
   */
  const gameStarts = async () => {
    const currentRoom: string = Communicate.getCurrentRoom(socket);
    state[currentRoom].isGameStarted = true;

    const startPositions = [...START_POSITIONS];

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
      const index = Math.floor(Math.random() * startPositions.length);
      const { i, j } = startPositions.splice(index, 1)[0];
      const pos = new Indices(i, j);
      Communicate.sendPrivateMessage(io, id, "game:startPos", pos);
    });
  };

  /**
   *
   * @returns Létrehozza a világot, meghívva a world creatWorld metódusát
   */
  const createWorld = (): Cell[][] => {
    const world: Cell[][] = World.createWorld();
    World.setWorld(world, socket);

    return world;
  };

  /**
   *
   * @param {Cell[][]} world világ
   * @returns Visszatér a cellák típusaival
   */
  const getTiles = (world: Cell[][]): TileType[][] => {
    const tiles: TileType[][] = world.map((cells) =>
      cells.map((cell) => cell.getType())
    );

    return tiles;
  };

  /**
   *
   * @param {Cell[][]} world világ
   * @returns Visszatér a cellák akadályok típusaival
   */
  const getObstacles = (world: Cell[][]): any => {
    const obstacles: any = world.map((cells) =>
      cells.map((cell) => cell.getObstacleType())
    );

    return obstacles;
  };

  socket.on("game:starts", gameStarts);
};
