import { Server, Socket } from "socket.io";
import { MAP_SIZE } from "../settings";
import {
  getCurrentRoom,
  sendMessageToEveryOne,
  sendMessageToEveryOneExceptSender,
} from "../utils/utils";
import { gameState, TileType } from "../gameState";
import { Cell } from "../utils/cell";
import { AStar } from "../utils/astar";
import { Indices } from "../utils/point";

export const gameHandler = (io: Server, socket: Socket) => {
  const gameStarts = () => {
    sendMessageToEveryOneExceptSender(socket, "game:starts", {});
    sendMessageToEveryOne(io, socket, "game:createWorld", createWorld());
  };

  const checkIfPossibleToBuild = (xPos: number, yPos: number): boolean => {
    return gameState[getCurrentRoom(socket)].world[xPos][yPos].isPlaceable();
  };

  const initNeighbor = (result: Cell[][], cell: Cell) => {
    if (cell.i > 0) {
      cell.addNeighbors(result[cell.i - 1][cell.j]);
    }

    if (cell.i < MAP_SIZE - 1) {
      cell.addNeighbors(result[cell.i + 1][cell.j]);
    }

    if (cell.j > 0) {
      cell.addNeighbors(result[cell.i][cell.j - 1]);
    }

    if (cell.j < MAP_SIZE - 1) {
      cell.addNeighbors(result[cell.i][cell.j + 1]);
    }

    if (cell.i > 0 && cell.j > 0) {
      cell.addNeighbors(result[cell.i - 1][cell.j - 1]);
    }

    if (cell.i < MAP_SIZE - 1 && cell.j < MAP_SIZE - 1) {
      cell.addNeighbors(result[cell.i + 1][cell.j + 1]);
    }

    if (cell.i > 0 && cell.j < MAP_SIZE - 1) {
      cell.addNeighbors(result[cell.i - 1][cell.j + 1]);
    }

    if (cell.i < MAP_SIZE - 1 && cell.j > 0) {
      cell.addNeighbors(result[cell.i + 1][cell.j - 1]);
    }
  };

  const createWorld = (): TileType[][] => {
    const result: Cell[][] = [];

    for (let i = 0; i < MAP_SIZE; ++i) {
      result.push([]);
      for (let j = 0; j < MAP_SIZE; ++j) {
        const r = Math.random();
        const cell = new Cell(i, j);

        // if (i === 5) {
        //   cell.setBuilding("asdf");
        // }

        if (r < 0.05) {
          // cell.setType(Math.random() < 0.5 ? "flower" : "rock");
          cell.setType("flower");
        }

        result[i].push(cell);
      }
    }

    for (let i = 0; i < MAP_SIZE; ++i) {
      for (let j = 0; j < MAP_SIZE; ++j) {
        initNeighbor(result, result[i][j]);
      }
    }

    gameState[getCurrentRoom(socket)].world = { ...result };

    const types: TileType[][] = result.map((cells) =>
      cells.map((cell) => cell.getType())
    );

    return types;
  };

  const build = ({
    indices,
    image,
    width,
    height,
  }: {
    indices: Indices;
    image: string;
    width: number;
    height: number;
  }): void => {
    const i = indices.i;
    const j = indices.j;

    if (!checkIfPossibleToBuild(i, j)) {
      return;
    }

    const world = gameState[getCurrentRoom(socket)].world[i][j];
    world.setBuilding(image);

    sendMessageToEveryOne(io, socket, "game:build", {
      indices,
      image: world.getBuilding(),
      width,
      height,
    });
  };

  const destroy = (indices: Indices): void => {
    const i = indices.i;
    const j = indices.j;

    gameState[getCurrentRoom(socket)].world[i][j].setBuilding(null);
    sendMessageToEveryOne(io, socket, "game:destroy", indices);
  };

  const pathFind = ({ start, end }: { start: Indices; end: Indices }) => {
    const world: Cell[][] = gameState[getCurrentRoom(socket)].world;
    const startCell: Cell = world[start.i][start.j];
    const endCell: Cell = world[end.i][end.j];

    const path: Indices[] = AStar.getPath(startCell, endCell);

    sendMessageToEveryOne(io, socket, "game:pathFind", path);
  };

  socket.on("game:starts", gameStarts);
  socket.on("game:build", build);
  socket.on("game:destroy", destroy);
  socket.on("game:pathFind", pathFind);
};
