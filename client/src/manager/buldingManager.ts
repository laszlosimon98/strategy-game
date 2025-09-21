import type { Building } from "@/game/world/building/building";
import { PlayerManager } from "@/manager/playerManager";
import type { BuildingPrices } from "@/types/building.types";
import type { EntityType, ImageItemType, StateType } from "@/types/game.types";

export class BuildingManager {
  private static buildingPrices: BuildingPrices = {
    bakery: { wood: 0, stone: 0 },
    barracks: { wood: 0, stone: 0 },
    farm: { wood: 0, stone: 0 },
    forester: { wood: 0, stone: 0 },
    guardhouse: { wood: 0, stone: 0 },
    ironsmelter: { wood: 0, stone: 0 },
    mill: { wood: 0, stone: 0 },
    residence: { wood: 0, stone: 0 },
    sawmill: { wood: 0, stone: 0 },
    stonecutter: { wood: 0, stone: 0 },
    storage: { wood: 0, stone: 0 },
    toolsmith: { wood: 0, stone: 0 },
    weaponsmith: { wood: 0, stone: 0 },
    well: { wood: 0, stone: 0 },
    woodcutter: { wood: 0, stone: 0 },
  };
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

  public static setBuildingPrices(prices: BuildingPrices): void {
    this.buildingPrices = { ...prices };
  }

  public static getBuildingPrices(): BuildingPrices {
    return this.buildingPrices;
  }
}
