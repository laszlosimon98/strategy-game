import { Socket } from "socket.io";
import alea from "alea";
import { createNoise2D } from "simplex-noise";

import { ServerHandler } from "@/server/serverHandler";
import { Cell } from "@/game/cell";
import { Indices } from "@/utils/indices";
import { settings } from "@/settings";
import { StateManager } from "@/manager/stateManager";
import { ObstacleEnum } from "@/enums/ObstacleEnum";
import { Tree } from "@/game/produceable/tree";
import { Stone } from "@/game/produceable/stone";
import { Building } from "@/game/building";
import { GuardHouse } from "@/game/buildings/military/guardhouse";
import { EntityType } from "@/types/state.types";
import { TileEnum } from "@/enums/tileEnum";
import { calculateDistanceByIndices } from "@/utils/utils";
import { BuildingManager } from "@/manager/buildingManager";
import { DestroyBuildingResponse } from "@/types/world.types";

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
        const cell: Cell = this.world[i][j];
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

  public static getTiles(socket: Socket): TileEnum[][] {
    const tiles: TileEnum[][] = StateManager.getWorld(socket).map((cells) =>
      cells.map((cell) => cell.getType())
    );

    return tiles;
  }

  public static getObstacles(socket: Socket): any {
    const obstacles: any = StateManager.getWorld(socket).map((cells) =>
      cells.map((cell) => cell.getHighestPriorityObstacleType())
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
    options?: {
      id: string;
    }
  ): Cell[] {
    const room: string = ServerHandler.getCurrentRoom(socket);

    let buildings: Building[];
    if (options && options.id) {
      buildings = StateManager.getBuildings(room, options.id);
    } else {
      buildings = StateManager.getAllPlayerBuildings(room);
    }

    const guardHouses: GuardHouse[] = buildings.filter(
      (building) => building.getEntity().data.name === "guardhouse"
    );

    const updatedCells: Cell[] = [];

    guardHouses.forEach((guardHouse) => {
      const { owner } = guardHouse.getEntity().data;
      const range = guardHouse.getRange();

      const handleTerritory = (cell: Cell): void => {
        if (
          !cell.getOwner() ||
          cell.getOwner() === guardHouse.getEntity().data.owner
        ) {
          cell.setOwner(owner);
          cell.setTowerInfluence(true);

          updatedCells.push(cell);
        }
      };

      this.updateWorldInRange(
        socket,
        guardHouse,
        range,
        (cell: Cell) => handleTerritory(cell),
        { isCircle: true }
      );
    });

    updatedCells.forEach((cell) => {
      cell.removeObstacle(ObstacleEnum.Border);
      if (this.isCellBorder(cell)) {
        cell.addObstacle(ObstacleEnum.Border);
      }
    });

    return updatedCells;
  }

  public static occupyCells(socket: Socket, building: Building) {
    const { i, j } = building.getEntity().data.indices;
    const world = StateManager.getWorld(socket);

    world[i][j].setBuilding(building);

    this.updateWorldInRange(socket, building, 1, (cell: Cell) => {
      cell.addObstacle(ObstacleEnum.Occupied);
    });
    world[i][j].addObstacle(ObstacleEnum.House);
  }

  public static restoreCells(socket: Socket, building: Building) {
    const { i, j } = building.getEntity().data.indices;
    const world = StateManager.getWorld(socket);

    this.updateWorldInRange(socket, building, 1, (cell: Cell) => {
      cell.removeObstacle(ObstacleEnum.Occupied);
    });
    world[i][j].removeObstacle(ObstacleEnum.House);
  }

  public static markCellToRestore(socket: Socket, building: Building): Cell[] {
    const range: number = building.getRange();
    const markedCells: Cell[] = [];

    this.updateWorldInRange(
      socket,
      building,
      range,
      (cell: Cell) => {
        cell.setOwner(null);
        cell.removeObstacle(ObstacleEnum.Border);
        cell.setTowerInfluence(false);
        markedCells.push(cell);
      },
      { isCircle: true }
    );

    return markedCells;
  }

  public static markedLostBuildings(
    socket: Socket,
    markedCells: Cell[]
  ): Building[] {
    const lostCells: Cell[] = markedCells.filter(
      (cell) => !cell.getTowerInfluence()
    );

    const world: Cell[][] = StateManager.getWorld(socket);
    const lostBuildings: Building[] = [];

    lostCells.forEach((cell) => {
      const { i, j } = cell.getIndices();
      const getCellBuilding: Building | null = world[i][j].getBuilding();

      if (getCellBuilding !== null) {
        world[i][j].setBuilding(null);
        lostBuildings.push(getCellBuilding);
      }
    });

    return lostBuildings;
  }

  public static cleanupPlayerTerritory(socket: Socket, id: string): void {
    const room: string = ServerHandler.getCurrentRoom(socket);
    const buildings: Building[] = StateManager.getBuildings(room, id);
    const guardHouses: GuardHouse[] = buildings.filter(
      (building) => building.getEntity().data.name === "guardhouse"
    );

    guardHouses.forEach((guardHouse) => {
      this.cleanTerritory(socket, guardHouse);
    });
  }

  public static cleanTerritory(
    socket: Socket,
    building: Building
  ): DestroyBuildingResponse {
    const room: string = ServerHandler.getCurrentRoom(socket);
    const state = StateManager.getState();

    if (!(building instanceof GuardHouse)) {
      BuildingManager.destroyBuilding(room, state, building);
      World.restoreCells(socket, building);

      return {
        updatedCells: [],
        markedCells: [],
        lostBuildings: [],
      };
    }

    const markedCells: Cell[] = World.markCellToRestore(socket, building) ?? [];

    BuildingManager.destroyBuilding(room, state, building);
    World.restoreCells(socket, building);

    const updatedCells: Cell[] = World.updateTerritory(socket);

    const lostBuildings: Building[] = World.markedLostBuildings(
      socket,
      markedCells
    );

    lostBuildings.forEach((building) => {
      BuildingManager.destroyBuilding(room, state, building);
      World.restoreCells(socket, building);
    });

    return {
      updatedCells,
      markedCells,
      lostBuildings,
    };
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
          cell.setType(TileEnum.Flower);
        }

        if (terrainNoise >= 93) {
          cell.setType(TileEnum.Rock);
        }

        if (treeNoise >= 50 || treeNoise <= -50) {
          cell.addObstacle(ObstacleEnum.Tree);
          cell.setInstance(new Tree());
        } else if (stoneNoise >= 60 || stoneNoise <= -80) {
          cell.addObstacle(ObstacleEnum.Stone);
          cell.setInstance(new Stone());
        }

        if (terrainNoise >= 80 && terrainNoise <= 90) {
          if (cell.getHighestPriorityObstacleType() === ObstacleEnum.Empty) {
            cell.setType(TileEnum.Dirt);
          }
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
    mirroredCell.addObstacle(originalCell.getHighestPriorityObstacleType());
    mirroredCell.setInstance(originalCell.getInstance());
  }

  private static updateWorldInRange(
    socket: Socket,
    building: Building,
    range: number,
    fn: (cell: Cell) => void,
    options?: { isCircle: boolean }
  ): void {
    const world: Cell[][] = StateManager.getWorld(socket);
    const { i: baseI, j: baseJ } = building.getEntity().data.indices;
    const size: number = settings.mapSize;
    const isCircle = options?.isCircle ?? false;

    const startI = Math.max(baseI - range, 0);
    const endI = Math.min(baseI + range, size - 1);
    const startJ = Math.max(baseJ - range, 0);
    const endJ = Math.min(baseJ + range, size - 1);

    for (let row = startI; row <= endI; ++row) {
      for (let col = startJ; col <= endJ; ++col) {
        const cell: Cell = world[row][col];

        if (isCircle) {
          const distance = calculateDistanceByIndices(
            cell.getIndices(),
            new Indices(baseI, baseJ)
          );
          if (distance < range) {
            fn(cell);
          }
        } else {
          fn(cell);
        }
      }
    }
  }

  private static isCellBorder(cell: Cell): boolean {
    return cell
      .getNeighbors()
      .some((neighbour) => neighbour.getOwner() !== cell.getOwner());
  }
}
