import type { Building } from "@/game/world/building/building";
import { PlayerManager } from "@/manager/playerManager";
import type { EntityType, ImageItemType, StateType } from "@/types/game.types";

export class BuildingManager {
  private constructor() {}

  public static resetBuilder(state: StateType, entity: EntityType): void {
    state.game.builder.data = { ...entity.data };
  }

  public static setBuilder(state: StateType, image: ImageItemType) {
    state.game.builder.data = {
      ...state.game.builder.data,
      ...image,
    };
  }

  public static getBuilder(state: StateType): EntityType {
    return state.game.builder;
  }

  public static getBuildings(state: StateType, id: string): Building[] {
    return PlayerManager.getPlayerById(state, id).buildings;
  }

  public static createBuilding(
    state: StateType,
    entity: EntityType,
    building: Building
  ): void {
    const id: string = entity.data.owner;
    const buildingsReference: Building[] = BuildingManager.getBuildings(
      state,
      id
    );
    buildingsReference.push(building);
  }
}
