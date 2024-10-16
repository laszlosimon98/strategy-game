import { ServerHandler } from "../../server/serverHandler";
import { Dimension } from "../../utils/dimension";
import { Indices } from "../../utils/indices";
import { Position } from "../../utils/position";
import { Building } from "./building";
import { BuildingType } from "../types/types";
import { initState, selectedBuilding } from "../../data/selectedBuilding";
import { FakeBuilding } from "./fakeBuilding";

export class Builder {
  private buildings: Building[];

  private buildingPos: Position;

  private fakeHouse: FakeBuilding;

  constructor() {
    this.buildings = [];
    this.fakeHouse = new FakeBuilding(
      new Indices(-1, -1),
      selectedBuilding.data
    );

    this.buildingPos = Position.zero();

    this.handleCommunication();
  }

  setBuildingPos(buildingPos: Position): void {
    this.buildingPos = buildingPos;
  }

  public draw(): void {
    this.buildings.forEach((building) => building.draw());
    this.fakeHouse.draw();
  }

  public update(mousePos: Position, cameraScroll: Position): void {
    this.buildings.forEach((building) => building.update(cameraScroll));
    this.fakeHouse.update(cameraScroll);

    if (!selectedBuilding.data.url.length && this.fakeHouse.getBuilding().url) {
      this.resetStates();
    }

    if (selectedBuilding.data.url !== this.fakeHouse.getBuilding().url) {
      this.fakeHouse.setPos(mousePos.sub(cameraScroll));
      this.fakeHouse.setBuilding(selectedBuilding.data);
    }
  }

  public handleClick(indices: Indices): void {
    if (selectedBuilding.data.url.length) {
      ServerHandler.sendMessage("game:build", {
        indices,
        building: selectedBuilding.data,
        buildingPos: this.buildingPos,
      });
    }
  }

  public handleMouseMove(): void {
    if (selectedBuilding.data.url.length) {
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
