import { BuildingType } from "../../types/types";
import { Dimension } from "../utils/dimension";
import { Indices } from "../utils/indices";

export class Building {
  private building: BuildingType;

  public constructor(building: BuildingType) {
    this.building = building;
  }

  public getBuilding(): BuildingType {
    return this.building;
  }

  public setOwner(newOwner: string): void {
    this.building.data.owner = newOwner;
  }
}
