import { Cell } from '@/src/game/classes/cell';
import { Indices } from '@/src/game/classes/indices';
import { MAP_SIZE, MAP_SEED, ROCK_SPAWN_CHANCE } from '@/src/settings';
import { createNoise2D } from 'simplex-noise';

const alea = require('alea');

export class World {
  private static world: Cell[][] = [];
  // private static noise2D = createNoise2D();
  private static scale = MAP_SIZE / 2;
  private static noise2D = createNoise2D(alea(MAP_SEED));
  private static mapSize = Math.floor(MAP_SIZE / 2);
  private constructor() {}

  /**
   * Inicializálja a az adott cella szomszédait
   */
  private static initNeighbor() {
    for (let l = 0; l < MAP_SIZE; ++l) {
      for (let k = 0; k < MAP_SIZE; ++k) {
        const cell: Cell = this.world[l][k];
        const { i, j } = cell.getIndices();

        if (i > 0) {
          cell.addNeighbors(this.world[i - 1][j]);
        }

        if (i < MAP_SIZE - 1) {
          cell.addNeighbors(this.world[i + 1][j]);
        }

        if (j > 0) {
          cell.addNeighbors(this.world[i][j - 1]);
        }

        if (j < MAP_SIZE - 1) {
          cell.addNeighbors(this.world[i][j + 1]);
        }

        if (i > 0 && j > 0) {
          cell.addNeighbors(this.world[i - 1][j - 1]);
        }

        if (i < MAP_SIZE - 1 && j < MAP_SIZE - 1) {
          cell.addNeighbors(this.world[i + 1][j + 1]);
        }

        if (i > 0 && j < MAP_SIZE - 1) {
          cell.addNeighbors(this.world[i - 1][j + 1]);
        }

        if (i < MAP_SIZE - 1 && j > 0) {
          cell.addNeighbors(this.world[i + 1][j - 1]);
        }
      }
    }
  }

  /**
   * Feltölti a pályát akadályokkal, nyersanyagokkal
   */
  private static populateWorld() {
    for (let i = 0; i < this.mapSize; ++i) {
      for (let j = 0; j < this.mapSize; ++j) {
        const terrainNoise = 100 * this.noise2D(i, j);
        const treeNoise = 100 * this.noise2D(i / this.scale, j / this.scale);
        const stoneNoise =
          100 * this.noise2D((i / this.scale) * 2, (j / this.scale) * 2);

        const cell: Cell = this.world[i][j];

        if (terrainNoise >= 0 && terrainNoise <= 1) {
          cell.setType('grass_flower');
        }

        if (terrainNoise >= ROCK_SPAWN_CHANCE) {
          cell.setType('grass_rock');
        }

        if (treeNoise >= 50 || treeNoise <= -50) {
          cell.setObstacle(true);
          cell.setObstacleType('tree');
        } else if (stoneNoise >= 60 || stoneNoise <= -80) {
          cell.setObstacle(true);
          cell.setObstacleType('stone');
        }
      }
    }
  }

  /**
   * Letükrözi a pályát a különböző irányok mentén
   */
  private static mirrorWorld() {
    for (let i = 0; i < this.mapSize; ++i) {
      for (let j = 0; j < this.mapSize; ++j) {
        const originalCell: Cell = this.world[i][j];
        const xAxis: Cell = this.world[i][MAP_SIZE - j - 1];
        const yAxis: Cell = this.world[MAP_SIZE - i - 1][j];
        const xyAxis: Cell = this.world[MAP_SIZE - i - 1][MAP_SIZE - j - 1];

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

  /**
   *
   * @returns {Cell[][]} Visszatér a populált, tükrözött világgal
   */
  public static createWorld(): Cell[][] {
    this.world = [];
    for (let i = 0; i < MAP_SIZE; ++i) {
      this.world.push([]);
      for (let j = 0; j < MAP_SIZE; ++j) {
        const cell = new Cell(new Indices(i, j));
        this.world[i].push(cell);
      }
    }

    this.populateWorld();
    this.mirrorWorld();
    this.initNeighbor();

    return this.world;
  }

  // /**
  //  *
  //  * @param socket kliens
  //  * @returns Visszatér a klienshez tartozó világgal
  //  */
  // public static getWorld(socket: Socket): Cell[][] {
  //   return state[Communicate.getCurrentRoom(socket)].world;
  // }

  // /**
  //  *
  //  * @param {Cell[][] } world új világ
  //  * @param {Socket} socket kliens
  //  */
  // public static setWorld(world: Cell[][], socket: Socket): void {
  //   state[Communicate.getCurrentRoom(socket)].world = world;
  // }
}
