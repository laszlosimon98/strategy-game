import { images } from "../../data/images";
import { ServerHandler } from "../../server/serverHandler";
import { Dimension } from "../../utils/dimension";
import { Indices } from "../../utils/indices";
import { Position } from "../../utils/position";
import { Building } from "./building";
import { BuildingType } from "../types/types";

export class Builder {
  private buildings: Building[];

  private buildingPos: Position;
  private selectedBuilding: BuildingType | undefined;

  constructor() {
    this.buildings = [];

    this.buildingPos = Position.zero();
    this.selectedBuilding = undefined;

    this.handleCommunication();
  }

  setBuildingPos(buildingPos: Position): void {
    this.buildingPos = buildingPos;
  }

  public draw(): void {
    this.buildings.forEach((building) => building.draw());
  }

  public update(cameraScroll: Position): void {
    this.buildings.forEach((building) => building.update(cameraScroll));
  }

  public handleClick(indices: Indices): void {
    this.selectedBuilding = images.game.buildings.stonecutter;

    ServerHandler.sendMessage("game:build", {
      indices,
      building: this.selectedBuilding,
      buildingPos: this.buildingPos,
    });
  }

  private build(
    indices: Indices,
    building: BuildingType,
    buildingPos: Position
  ): void {
    if (building) {
      const i = indices.i;
      const j = indices.j;

      const newBuilding: Building = new Building(new Indices(i, j), building);

      const dimension: Dimension = newBuilding.getDimension();

      const housePos: Position = new Position(
        buildingPos.x - dimension.width / 2,
        buildingPos.y - dimension.height
      );

      newBuilding.setPos(housePos);
      this.buildings.push(newBuilding);
    }
  }

  // private destroy(): void {}

  private handleCommunication(): void {
    ServerHandler.receiveMessage(
      "game:build",
      ({
        indices,
        building,
        buildingPos,
      }: {
        indices: Indices;
        building: BuildingType;
        buildingPos: Position;
      }) => {
        this.build(indices, building, buildingPos);
      }
    );
  }
}
