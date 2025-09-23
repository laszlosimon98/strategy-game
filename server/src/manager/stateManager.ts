import { ServerHandler } from "@/classes/serverHandler";
import { Building } from "@/classes/game/building";
import { Cell } from "@/classes/game/cell";
import { Unit } from "@/classes/game/unit";
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
import { Indices } from "@/classes/utils/indices";
import { BuildingPrices } from "@/types/building.types";
import { StorageType } from "@/types/storage.types";
import { ErrorMessage } from "@/types/setting.types";

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

  public static getWorld(room: string): Cell[][] {
    return this.state[room].world;
  }

  public static setWorld(room: string, world: Cell[][]): void {
    this.state[room].world = world;
  }

  // ------------------- Building -------------------

  public static createBuilding(
    socket: Socket,
    entity: EntityType
  ): Building | ErrorMessage {
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

  public static destroyBuilding(socket: Socket, indices: Indices): boolean {
    return BuildingManager.destroy(socket, indices, this.state);
  }

  public static getBuidingPrices(): BuildingPrices {
    return BuildingManager.getBuildingPrices();
  }

  // ------------------- Units -------------------

  public static createUnit(room: string, socket: Socket, unit: Unit): void {
    UnitManager.createUnit(room, socket, this.state, unit);
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

  public static updateStorage(
    socket: Socket,
    room: string,
    newStorageValues: StorageType
  ): void {
    StorageManager.updateStorage(socket, room, this.state, newStorageValues);
  }
}
