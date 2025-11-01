import { Unit } from "@/game/units/unit";
import { ServerHandler } from "@/server/serverHandler";
import { StateManager } from "@/manager/stateManager";
import { ReturnMessage } from "@/types/setting.types";
import { EntityType, StateType } from "@/types/state.types";
import { Socket } from "socket.io";
import { Manager } from "@/manager/manager";
import { Soldier } from "@/game/units/soldier";
import { unitRegister } from "@/game/unitRegister";
import { Indices } from "@/utils/indices";
import { Cell } from "@/game/cell";
import { ObstacleEnum } from "@/enums/ObstacleEnum";
import { calculatePositionFromIndices } from "@/utils/utils";

export class UnitManager extends Manager {
  protected constructor() {
    super();
  }

  public static createSoldier(
    socket: Socket,
    state: StateType,
    entity: EntityType
  ): Soldier | ReturnMessage {
    const unitName: string = entity.data.name;
    const room: string = ServerHandler.getCurrentRoom(socket);

    if (this.storageHasWeapons(socket, room, unitName)) {
      const { i, j } = entity.data.indices;
      entity.data.indices = new Indices(i + 1, j);

      const cell: Cell = StateManager.getWorld(socket)[i + 1][j];
      cell.addObstacle(ObstacleEnum.Unit);

      const soldier = this.creator<Soldier>(unitRegister[unitName], entity);
      soldier.setOwner(entity.data.owner);
      soldier.setPosition(cell.getUnitPos());

      state[room].players[socket.id].units.push(soldier);

      return soldier;
    } else {
      return { message: "Nincs elegendő fegyver raktáron!" };
    }
  }

  public static getUnits(
    room: string,
    state: StateType,
    entity: EntityType
  ): Unit[] {
    return state[room].players[entity.data.owner].units;
  }

  public static setUnits(
    room: string,
    state: StateType,
    entity: EntityType,
    units: Unit[]
  ): void {
    state[room].players[entity.data.owner].units = [...units];
  }

  public static getUnit(
    room: string,
    state: StateType,
    entity: EntityType
  ): Unit | undefined {
    const units: Unit[] = this.getUnits(room, state, entity);
    return units.find((unit) => unit.getEntity().data.id === entity.data.id);
  }

  public static getUnitIndex(
    room: string,
    state: StateType,
    entity: EntityType
  ): number {
    const units: Unit[] = this.getUnits(room, state, entity);
    const indx: number = units.findIndex(
      (unit) => unit.getEntity().data.id === entity.data.id
    );
    return indx;
  }

  public static deleteUnit(room: string, state: StateType, unit: Unit): void {
    const entity: EntityType = unit.getEntity();

    let units: Unit[] = this.getUnits(room, state, entity);
    const unitIndx: number = this.getUnitIndex(room, state, entity);

    if (unitIndx !== -1) {
      units = [...units.splice(0, unitIndx), ...units.splice(unitIndx + 1)];
      this.setUnits(room, state, entity, units);
    }
  }

  private static storageHasWeapons(
    socket: Socket,
    room: string,
    name: string
  ): boolean {
    const hasPlayerEnoughSword: boolean = StateManager.hasMaterial(
      socket,
      room,
      "weapons",
      "sword",
      1
    );
    const hasPlayerEnoughShield: boolean = StateManager.hasMaterial(
      socket,
      room,
      "weapons",
      "shield",
      1
    );
    const hasPlayerEnoughBow: boolean = StateManager.hasMaterial(
      socket,
      room,
      "weapons",
      "bow",
      1
    );

    if (name === "knight") {
      return hasPlayerEnoughShield && hasPlayerEnoughSword;
    } else {
      return hasPlayerEnoughBow;
    }
  }
}
