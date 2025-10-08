import { Unit } from "@/classes/game/unit";
import { ServerHandler } from "@/classes/serverHandler";
import { StateManager } from "@/manager/stateManager";
import { ReturnMessage } from "@/types/setting.types";
import { EntityType, StateType } from "@/types/state.types";
import { UnitsType } from "@/types/units.types";
import { Socket } from "socket.io";

export class UnitManager {
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

  private static hasWeapons(
    socket: Socket,
    room: string,
    name: "knight" | "archer"
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

  public static getUnitProperties(): UnitsType {
    return this.unitProperties;
  }

  public static createUnit(
    socket: Socket,
    room: string,
    state: StateType,
    entity: EntityType,
    name: "knight" | "archer"
  ): Unit | ReturnMessage {
    if (this.hasWeapons(socket, room, name)) {
      const unit = new Unit(entity, name);
      const room: string = ServerHandler.getCurrentRoom(socket);
      state[room].players[socket.id].units.push(unit);

      return unit;
    } else {
      return { message: "Nincs elegendő fegyver raktáron!" };
    }
  }

  public static getUnits(
    room: string,
    state: StateType,
    entity: EntityType
  ): Unit[] {
    return [...state[room].players[entity.data.owner].units];
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
}
