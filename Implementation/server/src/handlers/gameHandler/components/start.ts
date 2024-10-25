import { Server, Socket } from "socket.io";
import { Communicate } from "../../../classes/communicate";
import { Cell } from "../../../classes/game/cell";
import { World } from "../../../classes/game/world";
import { Indices } from "../../../classes/utils/indices";
import { state } from "../../../data/state";
import { MAP_SIZE } from "../../../settings";
import { PlayerType, TileType } from "../../../types/types";

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

    const tiles = createWorld();
    Communicate.sendMessageToEveryOne(io, socket, "game:createWorld", tiles);

    const players: PlayerType = getPlayers();

    Object.keys(players).forEach((id) => {
      const i = Math.floor(Math.random() * MAP_SIZE);
      const j = Math.floor(Math.random() * MAP_SIZE);
      const pos = new Indices(i, j);
      Communicate.sendPrivateMessage(io, id, "game:startPos", pos);
    });
  };

  const createWorld = (): TileType[][] => {
    const world: Cell[][] = World.create();
    World.setWorld(world, socket);

    const tiles: TileType[][] = world.map((cells) =>
      cells.map((cell) => cell.getType())
    );

    return tiles;
  };

  socket.on("game:starts", gameStarts);
};
