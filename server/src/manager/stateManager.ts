import { ServerHandler } from "@/server/serverHandler";
import { Building } from "@/game/building";
import { Cell } from "@/game/cell";
import { Unit } from "@/game/unit";
import { settings } from "@/settings";
import type {
  ColorType,
  EntityType,
  StateType,
  PlayerType,
} from "@/types/state.types";
import type { UnitsType } from "@/types/units.types";
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

export class StateManager {
  private static state: StateType = {};

  private constructor() {}

  private static chooseColor(colors: ColorType[]): ColorType {
    const randomNumber = Math.floor(Math.random() * colors.length);

    const playerColor = colors[randomNumber];
    colors.splice(randomNumber, 1);
    return playerColor;
  }

  public static getState(): StateType {
    return this.state;
  }

  public static getUnitProperties(): UnitsType {
    return UnitManager.getUnitProperties();
  }

  public static newPlayerMessage(
    io: Server,
    socket: Socket,
    room: string,
    name: string
  ): void {
    const names = this.getPlayersNameInRoom(room);
    ServerHandler.sendMessageToEveryOne(io, socket, "connect:newPlayer", {
      players: names,
      message: `${name} csatlakozott a váróhoz!`,
    });
  }

  public static playerleftMessage(
    io: Server,
    socket: Socket,
    name: string
  ): void {
    ServerHandler.sendMessageToEveryOne(io, socket, "connect:playerLeft", {
      name,
      message: `${name} elhagyta a várót!`,
    });
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

  public static getPlayer(room: string, socket: Socket): PlayerType[""] {
    return this.state[room].players[socket.id];
  }

  public static getPlayers = (room: string): PlayerType => {
    return this.state[room].players;
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
    };
  }

  public static initPlayerInRoom(
    room: string,
    name: string,
    socket: Socket
  ): void {
    this.state[room].players[socket.id] = {
      name,
      color: this.chooseColor(this.state[room].remainingColors),
      buildings: [],
      units: [],
      storage: StorageManager.getInitStorage(),
    };
  }

  public static disconnectPlayer(room: string, socket: Socket): void {
    delete this.state[room].players[socket.id];
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

  public static getWorld(socket: Socket): Cell[][] {
    const room: string = ServerHandler.getCurrentRoom(socket);
    return this.state[room].world;
  }

  public static setWorld(socket: Socket, world: Cell[][]): void {
    const room: string = ServerHandler.getCurrentRoom(socket);
    this.state[room].world = world;
  }

  public static getClosestCell(objIndices: Indices, cell: Cell[]): Cell | null {
    if (cell.length === 0) return null;

    let closestCell = cell[0];
    for (let i = 1; i < cell.length; ++i) {
      if (
        calculateDistanceByIndices(cell[i].getIndices(), objIndices) <
        calculateDistanceByIndices(closestCell.getIndices(), objIndices)
      ) {
        closestCell = cell[i];
      }
    }

    return closestCell;
  }

  public static getWorldInRange(
    socket: Socket,
    indices: Indices,
    range: number,
    obstacle?: ObstacleEnum
  ): Cell[] {
    const result: Cell[] = [];

    const world: Cell[][] = this.getWorld(socket);
    const { i, j } = indices;
    const size: number = settings.mapSize;

    for (let l = -range; l <= range; ++l) {
      for (let k = -range; k <= range; ++k) {
        const il = i + l;
        const jk = j + k;

        if (il >= 0 && il < size && jk >= 0 && jk < size) {
          const cell: Cell = world[i + l][j + k];

          if (obstacle) {
            if (cell.getHighestPriorityObstacleType() === obstacle) {
              result.push(cell);
            }
          } else {
            result.push(cell);
          }
        }
      }
    }

    return result;
  }

  // ------------------- Building -------------------

  public static createBuilding(
    socket: Socket,
    entity: EntityType
  ): Building | ReturnMessage {
    return BuildingManager.build(socket, this.state, entity);
  }

  public static getBuildings(room: string, socket: Socket): Building[] {
    return BuildingManager.getBuildings(room, socket, this.state);
  }

  public static getBuilding(
    room: string,
    socket: Socket,
    building: Building
  ): Building | undefined {
    return BuildingManager.getBuilding(room, socket, this.state, building);
  }

  public static getBuildingByEntity(
    room: string,
    socket: Socket,
    entity: EntityType
  ): Building | undefined {
    return BuildingManager.getBuildingByEntity(
      room,
      socket,
      this.state,
      entity
    );
  }

  public static destroyBuilding(
    socket: Socket,
    entity: EntityType
  ): DestroyBuildingResponse {
    return BuildingManager.destroy(socket, entity, this.state);
  }

  public static getBuidingPrices(): BuildingPrices {
    return BuildingManager.getBuildingPrices();
  }

  // ------------------- Units -------------------

  public static createUnit(
    socket: Socket,
    room: string,
    entity: EntityType,
    name: "knight" | "archer"
  ): Unit | ReturnMessage {
    return UnitManager.createUnit(socket, room, this.state, entity, name);
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

  public static getUnitIndex(room: string, entity: EntityType): number {
    return UnitManager.getUnitIndex(room, this.state, entity);
  }

  public static deleteUnit(room: string, unit: Unit): void {
    UnitManager.deleteUnit(room, this.state, unit);
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
}
