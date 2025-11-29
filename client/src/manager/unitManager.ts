import type { Unit } from "@/game/world/unit/unit";
import { PlayerManager } from "@/manager/playerManager";
import type { EntityType, StateType } from "@/types/game.types";

/**
 * Egység kezelő osztály
 */
export class UnitManager {
  private constructor() {}

  public static createUnit(state: StateType, id: string, unit: Unit): void {
    const unitsReference: Unit[] = PlayerManager.getPlayerById(state, id).units;
    unitsReference.push(unit);
  }

  public static getUnits(state: StateType, id: string): Unit[] {
    const units: Unit[] = PlayerManager.getPlayerById(state, id).units;
    return units;
  }

  public static getUnit(
    state: StateType,
    entity: EntityType
  ): Unit | undefined {
    const { owner, id } = entity.data;
    const units: Unit[] = this.getUnits(state, owner);

    return units.find((unit) => unit.getEntity().data.id === id);
  }

  public static removeUnit(state: StateType, entity: EntityType): void {
    state.game.players[entity.data.owner].units = this.getUnits(
      state,
      entity.data.owner
    ).filter((unit) => unit.getEntity().data.id !== entity.data.id);
  }
}
