import { Unit } from "@/classes/game/unit";
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

  public static getUnitProperties(): UnitsType {
    return this.unitProperties;
  }

  public static createUnit(
    room: string,
    socket: Socket,
    state: StateType,
    unit: Unit
  ): void {
    state[room].players[socket.id].units.push(unit);
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
