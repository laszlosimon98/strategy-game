import type { Unit } from "@/game/world/unit/unit";
import { Soldier } from "@/game/world/unit/units/soldier";
import { PlayerManager } from "@/manager/playerManager";
import type { EntityType, StateType } from "@/types/game.types";

export class UnitManager {
  private constructor() {}

  public static createUnit(state: StateType, id: string, unit: Unit): void {
    const unitsReference: Unit[] = PlayerManager.getPlayerById(state, id).units;
    unitsReference.push(unit);
  }

  public static getUnits(state: StateType, id: string): Soldier[] {
    const units: Unit[] = PlayerManager.getPlayerById(state, id).units;
    const soldiers: Soldier[] = units.filter((unit) => unit instanceof Soldier);
    return soldiers;
  }

  public static getUnit(state: StateType, entity: EntityType): Soldier {
    const { owner, id } = entity.data;
    const units: Soldier[] = this.getUnits(state, owner);

    return units.find((unit) => unit.getEntity().data.id === id) as Soldier;
  }

  public static removeUnit(state: StateType, entity: EntityType): void {
    state.game.players[entity.data.owner].units = this.getUnits(
      state,
      entity.data.owner
    ).filter((unit) => unit.getEntity().data.id !== entity.data.id);
  }
}
