import { Server, Socket } from "socket.io";
import { gameState, TileType } from "../state/gameState";
import { Cell } from "../classes/utils/cell";
import { Indices } from "../classes/utils/indices";
import { Communicate } from "../classes/communicate";
import { PathFinder } from "../classes/pathFind/pathFinder";
import { World } from "../classes/game/world";
import { Builder, BuildType } from "../classes/game/builder";

export const gameHandler = (io: Server, socket: Socket) => {
  const gameStarts = () => {
    Communicate.sendMessageToEveryOneExceptSender(socket, "game:starts", {});
    Communicate.sendMessageToEveryOne(
      io,
      socket,
      "game:createWorld",
      createWorld()
    );
  };

  const createWorld = (): TileType[][] => {
    const world: Cell[][] = World.create();
    World.setWorld(world, socket);

    const types: TileType[][] = world.map((cells) =>
      cells.map((cell) => cell.getType())
    );

    return types;
  };

  const build = ({ indices, image, width, height }: BuildType): void => {
    Builder.build({ indices, image, socket });
    const buildingImage = Builder.getHouseImage(indices, socket);

    Communicate.sendMessageToEveryOne(io, socket, "game:build", {
      indices,
      image: buildingImage,
      width,
      height,
    });
  };

  const destroy = (indices: Indices): void => {
    Builder.destroy(indices, socket);
    Communicate.sendMessageToEveryOne(io, socket, "game:destroy", indices);
  };

  const pathFind = ({ start, end }: { start: Indices; end: Indices }) => {
    const world: Cell[][] = gameState[Communicate.getCurrentRoom(socket)].world;
    const path: Indices[] = PathFinder.getPath(world, start, end);

    Communicate.sendMessageToEveryOne(io, socket, "game:pathFind", path);
  };

  socket.on("game:starts", gameStarts);
  socket.on("game:build", build);
  socket.on("game:destroy", destroy);
  socket.on("game:pathFind", pathFind);
};
