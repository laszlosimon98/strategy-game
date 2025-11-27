import { CommunicationHandler } from "@/communication/communicationHandler";
import { Building } from "@/game/buildings/building";
import { Cell } from "@/game/cell";
import { Unit } from "@/game/units/unit";
import { settings } from "@/settings";
import type {
  ColorType,
  EntityType,
  StateType,
  PlayerType,
} from "@/types/state.types";
import { Server, Socket } from "socket.io";
import { StorageManager } from "@/manager/storageManager";
import { BuildingManager } from "@/manager/buildingManager";
import { UnitManager } from "@/manager/unitManager";
import { Indices } from "@/utils/indices";
import { BuildingPrices } from "@/types/building.types";
import { CombinedType, StorageType, CategoryType } from "@/types/storage.types";
import { ReturnMessage } from "@/types/setting.types";
import { ObstacleEnum } from "@/enums/ObstacleEnum";
import { calculateDistanceByIndices } from "@/utils/utils";
import { DestroyBuildingResponse } from "@/types/world.types";
import { GuardHouse } from "@/game/buildings/military/guardhouse";
import { Soldier } from "@/game/units/soldier";
import { prismaService } from "@/prisma/prisma";

export class StateManager {
  private static state: StateType = {};

  private constructor() {}

  public static getState(): StateType {
    return this.state;
  }

  public static newPlayerMessage(
    io: Server,
    socket: Socket,
    room: string,
    name: string
  ): void {
    const names = this.getPlayersNameInRoom(room);
    CommunicationHandler.sendMessageToEveryOne(
      io,
      socket,
      "connect:newPlayer",
      {
        players: names,
        message: `${name} csatlakozott a váróhoz!`,
      }
    );
  }

  public static playerleftMessage(
    io: Server,
    socket: Socket,
    name: string
  ): void {
    CommunicationHandler.sendMessageToEveryOne(
      io,
      socket,
      "connect:playerLeft",
      {
        name,
        message: `${name} elhagyta a várót!`,
      }
    );
  }

  public static generateGameCode(): string {
    let result = "";
    for (let i = 0; i < settings.codeLength; ++i) {
      result += Math.floor(Math.random() * 10).toString();
    }
    return result;
  }

  public static isGameStarted(room: string): boolean {
    return this.state[room].isGameStarted;
  }

  public static isRoomExists(room: string, io: Server): boolean {
    return io.sockets.adapter.rooms.has(room);
  }

  public static getRoomSize(room: string, io: Server): number {
    return io.sockets.adapter.rooms.get(room)!.size;
  }

  public static getPlayersNameInRoom(room: string): string[] {
    const result: string[] = [];

    Object.keys(this.state[room].players).forEach((id) => {
      result.push(this.state[room].players[id].name);
    });

    return result;
  }

  public static getPlayer(
    room: string,
    socket: Socket
  ): PlayerType[""] | undefined {
    if (!this.state[room]) return undefined;
    return this.state[room].players[socket.id];
  }

  public static getPlayers = (room: string): PlayerType => {
    return this.state[room].players;
  };

  public static getPlayerByName = (
    room: string,
    name: string
  ): PlayerType[""] | undefined => {
    const players = Object.values(this.getPlayers(room));
    const player = players.find((player) => player.name === name);

    return player;
  };

  public static restoreColor(room: string, color: ColorType): void {
    this.state[room].remainingColors.push(color);
  }

  public static initRoom(room: string): void {
    this.state[room] = {
      isGameStarted: false,
      players: {},
      world: [],
      remainingColors: [...settings.colors],
      winner: null,
    };
  }

  public static initPlayerInRoom(
    room: string,
    name: string,
    socket: Socket,
    isHost: boolean
  ): void {
    const uniqueName = this.generateUniqueName(room, name);
    this.state[room].players[socket.id] = {
      id: socket.id,
      name: uniqueName,
      isHost,
      color: this.chooseColor(this.state[room].remainingColors),
      buildings: [],
      units: [],
      storage: StorageManager.getInitStorage(),
      isStatisticUpdated: false,
    };
  }

  private static generateUniqueName(room: string, name: string): string {
    const existingNames = this.getPlayersNameInRoom(room);

    if (!existingNames.includes(name)) {
      return name;
    }

    let counter = 1;
    let uniqueName = `${name}_${counter}`;

    while (existingNames.includes(uniqueName)) {
      counter++;
      uniqueName = `${name}_${counter}`;
    }

    return uniqueName;
  }

  public static disconnectPlayer(room: string, socket: Socket): void {
    const player = this.state[room].players[socket.id];

    player.units.forEach((unit) => {
      if (unit instanceof Soldier) {
        const target = unit.getTarget();

        if (target) {
          target.setTarget(null);
        }

        unit.setTarget(null);
      }
      const cell: Cell = unit.getCell(room);
      cell.setOwner(null);
      cell.removeObstacle(ObstacleEnum.Unit);
    });

    player.buildings = [];
    player.units = [];
    player.storage = {} as StorageType;

    delete this.state[room].players[socket.id];
  }

  public static handlePlayerDisconnect(
    socket: Socket,
    room: string,
    color: ColorType
  ): void {
    this.restoreColor(room, color);
    this.disconnectPlayer(room, socket);
  }

  public static isGameRoomEmpty(room: string): boolean {
    return Object.keys(this.state[room].players).length === 0;
  }

  public static deleteLobby(room: string) {
    delete this.state[room];
  }

  public static startGame(room: string): void {
    this.state[room].isGameStarted = true;
  }

  public static getWorld(room: string, socket: Socket): Cell[][] {
    return this.state[room].world;
  }

  public static setWorld(socket: Socket, world: Cell[][]): void {
    const room: string = CommunicationHandler.getCurrentRoom(socket);
    if (!room) return;

    this.state[room].world = world;
  }

  public static getClosestCell(
    objIndices: Indices,
    cells: Cell[]
  ): Cell | null {
    if (cells.length === 0) return null;

    let closestCell: Cell = cells[0];

    for (let i = 1; i < cells.length; ++i) {
      const currentDistance: number = calculateDistanceByIndices(
        cells[i].getIndices(),
        objIndices
      );

      const closestDistance: number = calculateDistanceByIndices(
        closestCell.getIndices(),
        objIndices
      );

      if (currentDistance < closestDistance) {
        closestCell = cells[i];
      }
    }

    return closestCell;
  }

  public static getWorldInRange(
    socket: Socket,
    indices: Indices,
    range: number,
    obstacle: ObstacleEnum,
    room: string
  ): Cell[] {
    const result: Cell[] = [];

    const world: Cell[][] = this.getWorld(room, socket);
    const { i: baseI, j: baseJ } = indices;
    const size: number = settings.mapSize;

    const startI = Math.max(baseI - range, 0);
    const endI = Math.min(baseI + range, size - 1);
    const startJ = Math.max(baseJ - range, 0);
    const endJ = Math.min(baseJ + range, size - 1);

    for (let row = startI; row <= endI; ++row) {
      for (let col = startJ; col <= endJ; ++col) {
        const cell: Cell = world[row][col];
        const distance: number = calculateDistanceByIndices(
          indices,
          cell.getIndices()
        );

        if (
          cell.getHighestPriorityObstacleType() === obstacle &&
          distance <= range
        ) {
          result.push(cell);
        }
      }
    }

    return result;
  }

  // ------------------- Building -------------------

  public static createBuilding(
    socket: Socket,
    entity: EntityType,
    needMaterial: boolean = true
  ): Building | ReturnMessage {
    return BuildingManager.build(socket, this.state, entity, needMaterial);
  }

  public static getBuildings(room: string, owner: string): Building[] {
    return BuildingManager.getBuildings(room, owner, this.state);
  }

  public static getAllPlayerBuildings(room: string): Building[] {
    const buildings: Building[] = [];
    const playersKeys: string[] = Object.keys(this.state[room].players);

    playersKeys.forEach((key) => {
      this.getBuildings(room, key).forEach((building) =>
        buildings.push(building)
      );
    });

    return buildings;
  }

  public static getAllPlayerBuildingsSeparatedByKeys(
    room: string
  ): Record<string, Building[]> {
    const result: Record<string, Building[]> = {};
    const playersKeys: string[] = Object.keys(this.state[room].players);

    playersKeys.forEach((key) => {
      if (!result[key]) {
        result[key] = [];
      }

      this.getBuildings(room, key).forEach((building) =>
        result[key].push(building)
      );
    });

    return result;
  }

  public static getBuildingByEntity(
    room: string,
    entity: EntityType
  ): Building | undefined {
    return BuildingManager.getBuildingByEntity(room, this.state, entity);
  }

  public static destroyBuilding(
    socket: Socket,
    entity: EntityType,
    needValidation: boolean = true
  ): DestroyBuildingResponse | null {
    return BuildingManager.destroy(socket, entity, this.state, needValidation);
  }

  public static getBuidingPrices(): BuildingPrices {
    return BuildingManager.getBuildingPrices();
  }

  // ------------------- Units -------------------

  public static createSoldier(
    socket: Socket,
    entity: EntityType
  ): Soldier | ReturnMessage {
    return UnitManager.createSoldier(socket, this.state, entity);
  }

  public static getUnits(room: string, entity: EntityType): Unit[] {
    return UnitManager.getUnits(room, this.state, entity);
  }

  public static setUnits(
    room: string,
    entity: EntityType,
    units: Unit[]
  ): void {
    UnitManager.setUnits(room, this.state, entity, units);
  }

  public static getUnit(room: string, entity: EntityType): Unit | undefined {
    return UnitManager.getUnit(room, this.state, entity);
  }

  public static getSoldier(
    room: string,
    entity: EntityType
  ): Soldier | undefined {
    const unit: Unit | undefined = this.getUnit(room, entity);
    if (!unit) return;

    if (unit instanceof Soldier) return unit;
  }

  public static getUnitIndex(room: string, entity: EntityType): number {
    return UnitManager.getUnitIndex(room, this.state, entity);
  }

  public static deleteUnit(room: string, unit: Unit): void {
    UnitManager.deleteUnit(room, this.state, unit);
  }

  public static directions(): Record<string, number> {
    const assetSize: number = settings.assetSize;

    const result: Record<string, number> = {
      DOWN: assetSize * 0,
      DOWN_LEFT: assetSize * 1,
      LEFT: assetSize * 2,
      UP_LEFT: assetSize * 3,
      UP: assetSize * 4,
      UP_RIGHT: assetSize * 5,
      RIGHT: assetSize * 6,
      DOWN_RIGHT: assetSize * 7,
    };

    return result;
  }

  public static calculateFacing(current: Cell, next: Cell): string {
    const { i: ci, j: cj } = current.getIndices();
    const { i: ni, j: nj } = next.getIndices();

    const di = ni - ci;
    const dj = nj - cj;

    const directions: Record<string, string> = {
      "-1,-1": "UP",
      "0,-1": "UP_RIGHT",
      "1,-1": "RIGHT",
      "1,0": "DOWN_RIGHT",
      "1,1": "DOWN",
      "0,1": "DOWN_LEFT",
      "-1,1": "LEFT",
      "-1,0": "UP_LEFT",
    };

    return directions[`${Math.sign(di)},${Math.sign(dj)}`] ?? "";
  }

  // ------------------- Storage -------------------

  public static getStorage(socket: Socket, room: string): StorageType {
    return StorageManager.getCurrentStorage(socket, room, this.state);
  }

  public static getStorageItem(
    socket: Socket,
    room: string,
    type: CategoryType,
    name: string
  ) {
    return StorageManager.getStorageItem(socket, room, this.state, type, name);
  }

  public static hasMaterial(
    socket: Socket,
    room: string,
    type: CategoryType,
    name: CombinedType,
    amount: number
  ): boolean {
    return StorageManager.hasMaterial(
      socket,
      room,
      this.state,
      type,
      name,
      amount
    );
  }

  public static updateStorageItem(
    socket: Socket,
    room: string,
    type: CategoryType,
    name: CombinedType,
    amount: number
  ) {
    StorageManager.updateStorageItem(
      socket,
      room,
      this.state,
      type,
      name,
      amount
    );
  }

  // ------------------- Game Over -------------------

  public static isPlayerLostTheGame(
    socket: Socket,
    entity: EntityType
  ): boolean {
    const room: string = CommunicationHandler.getCurrentRoom(socket);
    if (!room) return true;

    const buildings: Building[] = this.getBuildings(room, entity.data.owner);
    const guardHouses: GuardHouse[] = buildings.filter(
      (building) => building.getEntity().data.name === "guardhouse"
    );

    return guardHouses.length === 0;
  }

  public static isGameOver(socket: Socket): boolean {
    let count: number = 0;
    let winner: string = "";

    const room: string = CommunicationHandler.getCurrentRoom(socket);
    if (!room) return true;

    const playersBuildings: Record<string, Building[]> =
      this.getAllPlayerBuildingsSeparatedByKeys(room);

    const keys: string[] = Object.keys(playersBuildings);

    keys.forEach((key) => {
      if (playersBuildings[key].length > 0) {
        count++;
        winner = key;
      }
    });

    if (count === 1) {
      this.setWinner(socket, winner);
      return true;
    }

    return false;
  }

  public static getRemainigPlayerCount(socket: Socket): number {
    const room: string = CommunicationHandler.getCurrentRoom(socket);
    if (!room) return 0;

    return Object.keys(StateManager.getPlayers(room)).length;
  }

  public static getWinner(socket: Socket): string | null {
    const room: string = CommunicationHandler.getCurrentRoom(socket);
    if (!room) return null;

    return this.state[room].winner;
  }

  private static setWinner(socket: Socket, key: string): void {
    const room: string = CommunicationHandler.getCurrentRoom(socket);
    if (!room) return;

    const { name } = this.getPlayers(room)[key];
    this.state[room].winner = name;
  }

  private static chooseColor(colors: ColorType[]): ColorType {
    const randomNumber = Math.floor(Math.random() * colors.length);

    const playerColor = colors[randomNumber];
    colors.splice(randomNumber, 1);
    return playerColor;
  }

  // ------------------- Statistic -------------------

  public static async updateStatistic(
    username: string,
    status: "win" | "lose"
  ) {
    const user = await prismaService.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) return;

    try {
      const currentStatistic = await prismaService.statistic.findUnique({
        where: {
          usersid: user.id,
        },
      });

      await prismaService.statistic.update({
        where: {
          usersid: user.id,
        },
        data: {
          losses:
            status === "lose" ? (currentStatistic?.losses ?? 0) + 1 : undefined,
          wins:
            status === "win" ? (currentStatistic?.wins ?? 0) + 1 : undefined,
        },
      });
    } catch (e) {
      console.error(e);
    }
  }

  public static setPlayerStatisticToUpdated(user: PlayerType[""]): void {
    user.isStatisticUpdated = true;
  }
}
