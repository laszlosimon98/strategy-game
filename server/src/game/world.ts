import { Socket } from "socket.io";
import alea from "alea";
import { createNoise2D } from "simplex-noise";

import { ServerHandler } from "@/server/serverHandler";
import { Cell } from "@/game/cell";
import { Indices } from "@/utils/indices";
import { settings } from "@/settings";
import { StateManager } from "@/manager/stateManager";
import { CellTypeEnum } from "@/enums/cellTypeEnum";

export class World {
  private static world: Cell[][] = [];
  // private static noise2D = createNoise2D();
  private static scale = settings.mapSize / 2;
  private static noise2D = createNoise2D(alea(settings.mapSeed));
  private static mapSize = Math.floor(settings.mapSize / 2);
  private constructor() {}

  private static initNeighbor() {
    const size = settings.mapSize;
    const dirs = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
      [-1, -1],
      [1, 1],
      [-1, 1],
      [1, -1],
    ];

    for (let i = 0; i < size; ++i) {
      for (let j = 0; j < size; ++j) {
        const cell = this.world[i][j];
        for (const [di, dj] of dirs) {
          const ni = i + di;
          const nj = j + dj;

          if (ni >= 0 && ni < size && nj >= 0 && nj < size) {
            cell.addNeighbors(this.world[ni][nj]);
          }
        }
      }
    }
    // for (let l = 0; l < settings.mapSize; ++l) {
    //   for (let k = 0; k < settings.mapSize; ++k) {
    //     const cell: Cell = this.world[l][k];
    //     const { i, j } = cell.getIndices();

    //     if (i > 0) {
    //       cell.addNeighbors(this.world[i - 1][j]);
    //     }

    //     if (i < settings.mapSize - 1) {
    //       cell.addNeighbors(this.world[i + 1][j]);
    //     }

    //     if (j > 0) {
    //       cell.addNeighbors(this.world[i][j - 1]);
    //     }

    //     if (j < settings.mapSize - 1) {
    //       cell.addNeighbors(this.world[i][j + 1]);
    //     }

    //     if (i > 0 && j > 0) {
    //       cell.addNeighbors(this.world[i - 1][j - 1]);
    //     }

    //     if (i < settings.mapSize - 1 && j < settings.mapSize - 1) {
    //       cell.addNeighbors(this.world[i + 1][j + 1]);
    //     }

    //     if (i > 0 && j < settings.mapSize - 1) {
    //       cell.addNeighbors(this.world[i - 1][j + 1]);
    //     }

    //     if (i < settings.mapSize - 1 && j > 0) {
    //       cell.addNeighbors(this.world[i + 1][j - 1]);
    //     }
    //   }
    // }
  }

  private static populateWorld() {
    for (let i = 0; i < this.mapSize; ++i) {
      for (let j = 0; j < this.mapSize; ++j) {
        const terrainNoise = 100 * this.noise2D(i, j);
        const treeNoise = 100 * this.noise2D(i / this.scale, j / this.scale);
        const stoneNoise =
          100 * this.noise2D((i / this.scale) * 2, (j / this.scale) * 2);

        const cell: Cell = this.world[i][j];

        if (terrainNoise >= 0 && terrainNoise <= 1) {
          cell.setType("grass_flower");
        }

        if (terrainNoise >= settings.rockspawnChance) {
          cell.setType("grass_rock");
        }

        if (treeNoise >= 50 || treeNoise <= -50) {
          cell.setObstacle(true);
          cell.setObstacleType(CellTypeEnum.Tree);
        } else if (stoneNoise >= 60 || stoneNoise <= -80) {
          cell.setObstacle(true);
          cell.setObstacleType(CellTypeEnum.Stone);
        }
      }
    }
  }

  private static mirrorWorld() {
    for (let i = 0; i < this.mapSize; ++i) {
      for (let j = 0; j < this.mapSize; ++j) {
        const originalCell: Cell = this.world[i][j];
        const xAxis: Cell = this.world[i][settings.mapSize - j - 1];
        const yAxis: Cell = this.world[settings.mapSize - i - 1][j];
        const xyAxis: Cell =
          this.world[settings.mapSize - i - 1][settings.mapSize - j - 1];

        xAxis.setType(originalCell.getType());
        xAxis.setObstacleType(originalCell.getObstacleType());
        xAxis.setObstacle(originalCell.cellHasObstacle());

        yAxis.setType(originalCell.getType());
        yAxis.setObstacleType(originalCell.getObstacleType());
        yAxis.setObstacle(originalCell.cellHasObstacle());

        xyAxis.setType(originalCell.getType());
        xyAxis.setObstacleType(originalCell.getObstacleType());
        xyAxis.setObstacle(originalCell.cellHasObstacle());
      }
    }
  }

  public static createWorld(): Cell[][] {
    this.world = [];
    for (let i = 0; i < settings.mapSize; ++i) {
      this.world.push([]);
      for (let j = 0; j < settings.mapSize; ++j) {
        const cell = new Cell(new Indices(i, j));
        this.world[i].push(cell);
      }
    }

    this.populateWorld();
    this.mirrorWorld();
    this.initNeighbor();

    return this.world;
  }

  public static getWorld(socket: Socket): Cell[][] {
    const room = ServerHandler.getCurrentRoom(socket);
    return StateManager.getWorld(room);
  }

  public static setWorld(world: Cell[][], socket: Socket): void {
    const room = ServerHandler.getCurrentRoom(socket);
    StateManager.setWorld(room, world);
  }
}
