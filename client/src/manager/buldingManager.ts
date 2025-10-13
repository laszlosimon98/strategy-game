import type { Building } from "@/game/world/building/building";
import { PlayerManager } from "@/manager/playerManager";
import type { BuildingPrices } from "@/types/building.types";
import type { EntityType, ImageItemType, StateType } from "@/types/game.types";
import { getImageNameFromUrl } from "@/utils/utils";

export class BuildingManager {
  private static buildingPrices: BuildingPrices = {
    bakery: { boards: 0, stone: 0 },
    barracks: { boards: 0, stone: 0 },
    farm: { boards: 0, stone: 0 },
    forester: { boards: 0, stone: 0 },
    guardhouse: { boards: 0, stone: 0 },
    ironsmelter: { boards: 0, stone: 0 },
    mill: { boards: 0, stone: 0 },
    residence: { boards: 0, stone: 0 },
    sawmill: { boards: 0, stone: 0 },
    stonecutter: { boards: 0, stone: 0 },
    storage: { boards: 0, stone: 0 },
    toolsmith: { boards: 0, stone: 0 },
    weaponsmith: { boards: 0, stone: 0 },
    well: { boards: 0, stone: 0 },
    woodcutter: { boards: 0, stone: 0 },
  };
  private constructor() {}

  public static resetBuilder(state: StateType, entity: EntityType): void {
    state.game.builder.data = { ...entity.data };
  }

  public static setBuilder(state: StateType, image: ImageItemType) {
    state.game.builder.data = {
      ...state.game.builder.data,
      ...image,
      name: getImageNameFromUrl(image.url),
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
