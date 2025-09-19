import { ServerHandler } from "@/classes/serverHandler";
import { Building } from "@/classes/game/building";
import { Cell } from "@/classes/game/cell";
import { Unit } from "@/classes/game/unit";
import { settings } from "@/settings";
import type {
  ColorType,
  EntityType,
  InitialStateType,
  PlayerType,
} from "@/types/state.types";
import type { UnitsType } from "@/types/units.types";
import { Server, Socket } from "socket.io";
import { StorageManager } from "@/manager/storageManager";

export class StateManager {
  private static state: InitialStateType = {};
  private static unitProperties: UnitsType = {
    knight: {
      damage: 13,
      health: 100,
      range: 1,
    },
    archer: {
      damage: 9,
      health: 75,
      range: 5,
    },
  };

  private constructor() {}

  private static chooseColor(colors: ColorType[]): ColorType {
    const randomNumber = Math.floor(Math.random() * colors.length);

    const playerColor = colors[randomNumber];
    colors.splice(randomNumber, 1);
    return playerColor;
  }

  public static getState(): InitialStateType {
    return this.state;
  }

  public static getUnitProperties(): UnitsType {
    return this.unitProperties;
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

  public static createBuilding(
    room: string,
    socket: Socket,
    building: Building
  ) {
    this.state[room].players[socket.id].buildings.push(building);
  }

  public static getBuildings(room: string, socket: Socket): Building[] {
    return [...this.state[room].players[socket.id].buildings];
  }

  public static getBuilding(
    room: string,
    socket: Socket,
    building: Building
  ): Building | undefined {
    const buildings: Building[] = this.getBuildings(room, socket);
    return buildings.find(
      (b) => b.getEntity().data.id === building.getEntity().data.id
    );
  }

  public static destroyBuilding(
    room: string,
    socket: Socket,
    building: Building
  ) {
    const buildingToDemolish: Building | undefined = this.getBuilding(
      room,
      socket,
      building
    );

    if (!buildingToDemolish) return;

    const buildingIndex: number = this.state[room].players[
      socket.id
    ].buildings.findIndex(
      (b) => b.getEntity().data.id === buildingToDemolish.getEntity().data.id
    );

    if (buildingIndex === -1) return;

    this.state[room].players[socket.id].buildings.splice(buildingIndex, 1);
  }

  public static createUnit(room: string, socket: Socket, unit: Unit): void {
    this.state[room].players[socket.id].units.push(unit);
  }

  public static getUnits(room: string, entity: EntityType): Unit[] {
    return [...this.state[room].players[entity.data.owner].units];
  }

  public static setUnits(
    room: string,
    entity: EntityType,
    units: Unit[]
  ): void {
    this.state[room].players[entity.data.owner].units = [...units];
  }

  public static getUnit(room: string, entity: EntityType): Unit | undefined {
    const units: Unit[] = this.getUnits(room, entity);
    return units.find((unit) => unit.getEntity().data.id === entity.data.id);
  }

  public static getUnitIndex(room: string, entity: EntityType): number {
    const units: Unit[] = this.getUnits(room, entity);
    const indx: number = units.findIndex(
      (unit) => unit.getEntity().data.id === entity.data.id
    );
    return indx;
  }

  public static deleteUnit(room: string, unit: Unit): void {
    const entity: EntityType = unit.getEntity();

    let units: Unit[] = this.getUnits(room, entity);
    const unitIndx: number = this.getUnitIndex(room, entity);

    if (unitIndx !== -1) {
      units = [...units.splice(0, unitIndx), ...units.splice(unitIndx + 1)];
      this.setUnits(room, entity, units);
    }
  }
}
