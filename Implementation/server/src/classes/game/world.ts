import { Socket } from "socket.io";
import { MAP_SIZE } from "../../settings";
import { Communicate } from "../communicate";
import { Cell } from "./cell";
import { state } from "../../data/state";
import { Indices } from "../utils/indices";

export class World {
  private constructor() {}

  private static initNeighbor = (result: Cell[][], cell: Cell) => {
    const { i, j } = cell.getIndices();

    if (i > 0) {
      cell.addNeighbors(result[i - 1][j]);
    }

    if (i < MAP_SIZE - 1) {
      cell.addNeighbors(result[i + 1][j]);
    }

    if (j > 0) {
      cell.addNeighbors(result[i][j - 1]);
    }

    if (j < MAP_SIZE - 1) {
      cell.addNeighbors(result[i][j + 1]);
    }

    if (i > 0 && j > 0) {
      cell.addNeighbors(result[i - 1][j - 1]);
    }

    if (i < MAP_SIZE - 1 && j < MAP_SIZE - 1) {
      cell.addNeighbors(result[i + 1][j + 1]);
    }

    if (i > 0 && j < MAP_SIZE - 1) {
      cell.addNeighbors(result[i - 1][j + 1]);
    }

    if (i < MAP_SIZE - 1 && j > 0) {
      cell.addNeighbors(result[i + 1][j - 1]);
    }
  };

  public static create(): Cell[][] {
    const world: Cell[][] = [];

    for (let i = 0; i < MAP_SIZE; ++i) {
      world.push([]);
      for (let j = 0; j < MAP_SIZE; ++j) {
        const r = Math.random();
        const cell = new Cell(new Indices(i, j));

        if (r < 0.05) {
          const type = Math.random() < 0.5 ? "grass_flower" : "grass_rock";
          cell.setType(type);
        }

        world[i].push(cell);
      }
    }

    for (let i = 0; i < MAP_SIZE; ++i) {
      for (let j = 0; j < MAP_SIZE; ++j) {
        this.initNeighbor(world, world[i][j]);
      }
    }
    return world;
  }

  public static getWorld(socket: Socket): Cell[][] {
    return state[Communicate.getCurrentRoom(socket)].world;
  }

  public static setWorld(world: Cell[][], socket: Socket): void {
    state[Communicate.getCurrentRoom(socket)].world = world;
  }
}
