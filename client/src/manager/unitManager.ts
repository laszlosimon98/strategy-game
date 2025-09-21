import type { Unit } from "@/game/world/unit/unit";
import type { Soldier } from "@/game/world/unit/units/soldier";
import { PlayerManager } from "@/manager/playerManager";
import type { EntityType, StateType } from "@/types/game.types";

export class UnitManager {
  private constructor() {}

  public static createUnit(state: StateType, id: string, unit: Unit): void {
    const unitsReference: Unit[] = PlayerManager.getPlayerById(state, id).units;
    unitsReference.push(unit);
  }

  public static addUnitToMovingArray(
    state: StateType,
    id: string,
    unit: Unit
  ): void {
    const movingUnitsReference: Unit[] = PlayerManager.getPlayerById(
      state,
      id
    ).movingUnits;
    movingUnitsReference.push(unit);
  }

  public static getMovingUnits(state: StateType, id: string): Unit[] {
    return PlayerManager.getPlayerById(state, id).movingUnits;
  }

  public static getSoldiers(state: StateType, id: string): Soldier[] {
    return PlayerManager.getPlayerById(state, id).units;
  }

  public static findSoldier(state: StateType, entity: EntityType): Soldier {
    const { owner, id } = entity.data;
    const units: Soldier[] = this.getSoldiers(state, owner);

    return units.find((unit) => unit.getEntity().data.id === id) as Soldier;
  }
}
