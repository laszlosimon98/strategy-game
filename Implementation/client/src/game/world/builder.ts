import { ServerHandler } from "../../server/serverHandler";
import { Dimension } from "../../utils/dimension";
import { Indices } from "../../utils/indices";
import { Position } from "../../utils/position";
import { Building } from "./building";
import { BuildingType } from "../types/types";
import { initState, selectedBuilding } from "../../data/selectedBuilding";
import { ctx } from "../../init";

export class Builder {
  private buildings: Building[];

  private buildingPos: Position;
  private selectedBuilding: BuildingType | undefined;

  private fakeHouse: Building;

  constructor() {
    this.buildings = [];
    this.fakeHouse = new Building(new Indices(-1, -1), selectedBuilding.data);

    this.buildingPos = Position.zero();
    this.selectedBuilding = undefined;

    this.handleCommunication();
  }

  setBuildingPos(buildingPos: Position): void {
    this.buildingPos = buildingPos;
  }

  public draw(): void {
    this.buildings.forEach((building) => building.draw());

    ctx.save();
    ctx.globalAlpha = 0.75;
    this.fakeHouse.draw();
    ctx.restore();
  }

  public update(cameraScroll: Position): void {
    this.buildings.forEach((building) => building.update(cameraScroll));
    this.fakeHouse.update(cameraScroll);

    if (!selectedBuilding.data.url.length && this.fakeHouse.getBuilding().url) {
      this.resetStates();
    }
  }

  public handleClick(indices: Indices): void {
    this.selectedBuilding = selectedBuilding.data;

    if (this.selectedBuilding.url.length) {
      ServerHandler.sendMessage("game:build", {
        indices,
        building: this.selectedBuilding,
        buildingPos: this.buildingPos,
      });
    }
  }

  public handleMouseMove(): void {
    if (selectedBuilding.data.url.length) {
      this.fakeHouse.setBuilding(selectedBuilding.data);
      const dimension: Dimension = this.fakeHouse.getDimension();

      const housePos: Position = new Position(
        this.buildingPos.x - dimension.width / 2,
        this.buildingPos.y - dimension.height
      );

      this.fakeHouse.setPos(housePos);
    }
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

      this.resetStates();
    }
  }

  private resetStates(): void {
    selectedBuilding.data = { ...initState.data };
    this.selectedBuilding = undefined;
    this.fakeHouse.setBuilding(selectedBuilding.data);
    this.fakeHouse.setPos(new Position(0, -500));
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
