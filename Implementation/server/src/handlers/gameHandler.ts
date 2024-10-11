import { Server, Socket } from "socket.io";
import { gameState, TileType } from "../state/gameState";
import { Cell } from "../classes/utils/cell";
import { Indices } from "../classes/utils/indices";
import { Communicate } from "../classes/communicate";
import { PathFinder } from "../classes/pathFind/pathFinder";
import { World } from "../classes/game/world";
import { Builder, BuildType } from "../classes/game/builder";
import { MAP_SIZE } from "../settings";
import { Validator } from "../classes/validator";

export const gameHandler = (io: Server, socket: Socket) => {
  const gameStarts = async () => {
    const currentRoom = Communicate.getCurrentRoom(socket);
    gameState[currentRoom].isGameStarted = true;

    Communicate.sendMessageToEveryOne(io, socket, "game:starts", {});

    const tiles = createWorld();
    Communicate.sendMessageToEveryOne(io, socket, "game:createWorld", tiles);

    const players = gameState[Communicate.getCurrentRoom(socket)].players;

    players.forEach((player) => {
      const i = Math.floor(Math.random() * MAP_SIZE);
      const j = Math.floor(Math.random() * MAP_SIZE);
      const pos = new Indices(i, j);
      Communicate.sendPrivateMessage(io, player.playerId, "game:startPos", pos);
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

  const build = ({ indices, image }: BuildType): void => {
    // if (!Validator.validateIndices(indices)) {
    //   return;
    // }

    Builder.build({ indices, image, socket });
    const buildingImage = Builder.getHouseImage(indices, socket);

    Communicate.sendMessageToEveryOne(io, socket, "game:build", {
      indices,
      image: buildingImage,
    });
  };

  const destroy = (indices: Indices): void => {
    if (!Validator.validateIndices(indices)) {
      return;
    }

    const isSuccessfull: boolean = Builder.destroy(indices, socket);
    if (isSuccessfull) {
      Communicate.sendMessageToEveryOne(io, socket, "game:destroy", indices);
    }
  };

  const pathFind = ({ start, end }: { start: Indices; end: Indices }) => {
    if (!Validator.validateIndices(start) || !Validator.validateIndices(end)) {
      return;
    }

    const world: Cell[][] = gameState[Communicate.getCurrentRoom(socket)].world;
    const path: Indices[] = PathFinder.getPath(world, start, end);

    Communicate.sendMessageToEveryOne(io, socket, "game:pathFind", path);
  };

  socket.on("game:starts", gameStarts);
  socket.on("game:build", build);
  socket.on("game:destroy", destroy);
  socket.on("game:pathFind", pathFind);
};
