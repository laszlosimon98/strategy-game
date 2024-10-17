import { Server, Socket } from "socket.io";
import { Cell } from "../classes/game/cell";
import { Indices } from "../classes/utils/indices";
import { Communicate } from "../classes/communicate";
import { PathFinder } from "../classes/pathFind/pathFinder";
import { World } from "../classes/game/world";
import { Builder } from "../classes/game/builder";
import { MAP_SIZE } from "../settings";
import { Validator } from "../classes/validator";
import { BuildType, PlayerType, TileType } from "../types/types";
import { state } from "../data/state";
import { Building } from "../classes/game/building";

export const gameHandler = (io: Server, socket: Socket) => {
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

  const build = ({ building, buildingPos }: BuildType): void => {
    console.log(building);
    if (!Validator.validateIndices(building.data.indices)) {
      return;
    }

    const newBuilding: Building | undefined = Builder.build({
      building,
      socket,
    });

    if (newBuilding) {
      Communicate.sendMessageToEveryOne(io, socket, "game:build", {
        building: newBuilding.getBuilding(),
        buildingPos,
      });
    }
  };

  const destroy = (indices: Indices): void => {
    if (!Validator.validateIndices(indices)) {
      return;
    }

    const isSuccessful: boolean = Builder.destroy(indices, socket);
    if (isSuccessful) {
      Communicate.sendMessageToEveryOne(io, socket, "game:destroy", {
        id: socket.id,
        indices,
      });
    }
  };

  const pathFind = ({ start, end }: { start: Indices; end: Indices }) => {
    if (!Validator.validateIndices(start) || !Validator.validateIndices(end)) {
      return;
    }

    const world: Cell[][] = state[Communicate.getCurrentRoom(socket)].world;
    const path: Indices[] = PathFinder.getPath(world, start, end);

    Communicate.sendMessageToEveryOne(io, socket, "game:pathFind", path);
  };

  socket.on("game:starts", gameStarts);
  socket.on("game:build", build);
  socket.on("game:destroy", destroy);
  socket.on("game:pathFind", pathFind);
};
