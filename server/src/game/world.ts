import { Socket } from "socket.io";
import alea from "alea";
import { createNoise2D } from "simplex-noise";

import { ServerHandler } from "@/server/serverHandler";
import { Cell } from "@/game/cell";
import { Indices } from "@/utils/indices";
import { settings } from "@/settings";
import { StateManager } from "@/manager/stateManager";
import { CellTypeEnum } from "@/enums/cellTypeEnum";
import { Tree } from "@/game/produceable/tree";
import { Stone } from "@/game/produceable/stone";
import { Territory, TileType } from "@/types/world.types";
import { Building } from "@/game/building";
import { GuardHouse } from "@/game/buildings/military/guardhouse";
import { EntityType } from "@/types/state.types";

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
          cell.setInstance(new Tree());
        } else if (stoneNoise >= 60 || stoneNoise <= -80) {
          cell.setObstacle(true);
          cell.setObstacleType(CellTypeEnum.Stone);
          cell.setInstance(new Stone());
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

        this.mirrorCell(originalCell, xAxis);
        this.mirrorCell(originalCell, yAxis);
        this.mirrorCell(originalCell, xyAxis);
      }
    }
  }

  private static mirrorCell(originalCell: Cell, mirroredCell: Cell) {
    mirroredCell.setType(originalCell.getType());
    mirroredCell.setObstacleType(originalCell.getObstacleType());
    mirroredCell.setObstacle(originalCell.cellHasObstacle());
    mirroredCell.setInstance(originalCell.getInstance());
  }

  private static updateCell(
    socket: Socket,
    building: Building,
    range: number,
    fn: (cell: Cell) => void
  ): void {
    const world: Cell[][] = StateManager.getWorld(socket);
    const { i, j } = building.getEntity().data.indices;
    const size: number = settings.mapSize;

    for (let l = -range; l <= range; ++l) {
      for (let k = -range; k <= range; ++k) {
        const il = i + l;
        const jk = j + k;

        if (il >= 0 && il < size && jk >= 0 && jk < size) {
          const cell: Cell = world[i + l][j + k];
          fn(cell);
        }
      }
    }
  }

  public static createWorld(socket: Socket): void {
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

    StateManager.setWorld(socket, this.world);
    this.world = [];
  }

  public static getTiles(socket: Socket): TileType[][] {
    const tiles: TileType[][] = StateManager.getWorld(socket).map((cells) =>
      cells.map((cell) => cell.getType())
    );

    return tiles;
  }

  public static getObstacles(socket: Socket): any {
    const obstacles: any = StateManager.getWorld(socket).map((cells) =>
      cells.map((cell) => cell.getObstacleType())
    );

    return obstacles;
  }

  public static isCellInTerritory(socket: Socket, entity: EntityType): boolean {
    const { i, j } = entity.data.indices;
    const cells: Cell[][] = StateManager.getWorld(socket);

    return cells[i][j].getOwner() === entity.data.owner;
  }

  public static updateTerritory(
    socket: Socket,
    building: Building
  ): Territory[] | undefined {
    if (!(building instanceof GuardHouse)) return;

    const { owner } = building.getEntity().data;
    const range = building.getRange();
    const updatedCells: Territory[] = [];

    this.updateCell(socket, building, range, (cell: Cell) => {
      if (
        !cell.getOwner() ||
        cell.getOwner() === building.getEntity().data.owner
      ) {
        cell.setOwner(owner);
        cell.setTowerInfluence(true);

        updatedCells.push({
          indices: cell.getIndices(),
          owner,
        });
      }
    });

    return updatedCells;
  }

  public static markCellToRestoreOwner(
    socket: Socket,
    building: Building
  ): void {
    if (!(building instanceof GuardHouse)) return;

    const range = building.getRange();

    this.updateCell(socket, building, range, (cell: Cell) => {
      cell.setTowerInfluence(false);
    });
  }

  public static restoreCellsWithoutTowerInfluence(
    socket: Socket,
    building: Building
  ): Territory[] | undefined {
    if (!(building instanceof GuardHouse)) return;

    const range = building.getRange();
    const restoredCells: Territory[] = [];

    this.updateCell(socket, building, range, (cell: Cell) => {
      if (!cell.getTowerInfluence()) {
        cell.setOwner(null);
        restoredCells.push({
          indices: cell.getIndices(),
          owner: null,
        });
      }
    });

    return restoredCells;
  }

  public static occupyCells(socket: Socket, building: Building) {
    const { i, j } = building.getEntity().data.indices;
    const world = StateManager.getWorld(socket);

    world[i][j].setObstacleType(CellTypeEnum.House);
    world[i][j].setBuilding(building);

    this.updateCell(socket, building, 1, (cell: Cell) => {
      cell.setObstacle(true);
    });
  }

  public static restoreCells(socket: Socket, building: Building) {
    const { i, j } = building.getEntity().data.indices;
    const world = StateManager.getWorld(socket);

    world[i][j].setObstacleType(CellTypeEnum.Empty);

    this.updateCell(socket, building, 1, (cell: Cell) => {
      cell.setObstacle(false);
    });
  }

  public static handleGuardHouseDestruction(
    socket: Socket,
    building: Building
  ):
    | { restoredCells: Territory[]; lostTerritoryBuildings: Building[] }
    | undefined {
    const room: string = ServerHandler.getCurrentRoom(socket);

    this.markCellToRestoreOwner(socket, building);

    const guardHouses: Building[] = StateManager.getBuildings(
      room,
      socket
    ).filter((building) => building instanceof GuardHouse);

    guardHouses.forEach((guardHouse) =>
      this.updateTerritory(socket, guardHouse)
    );

    const restoredCells: Territory[] | undefined =
      this.restoreCellsWithoutTowerInfluence(socket, building);

    const lostTerritoryBuildings: Building[] | undefined =
      this.destroyBuildingOutsideTerritory(socket, restoredCells);

    if (!restoredCells || !lostTerritoryBuildings) return;

    return {
      restoredCells,
      lostTerritoryBuildings,
    };
  }

  private static destroyBuildingOutsideTerritory(
    socket: Socket,
    restoredCells: Territory[] | undefined
  ): Building[] | undefined {
    if (!restoredCells || (restoredCells && restoredCells.length === 0)) return;

    const world = StateManager.getWorld(socket);
    const lostTerritoryBuildings: Building[] = [];

    restoredCells.forEach((cell) => {
      const { i, j } = cell.indices;
      const getCellBuilding: Building | null = world[i][j].getBuilding();

      if (getCellBuilding !== null) {
        lostTerritoryBuildings.push(getCellBuilding);
        world[i][j].setObstacle(false);
        world[i][j].setObstacleType(CellTypeEnum.Empty);
        world[i][j].setBuilding(null);
      }
    });

    return lostTerritoryBuildings;
  }
}
