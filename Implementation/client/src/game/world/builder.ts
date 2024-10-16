import { ServerHandler } from "../../server/serverHandler";
import { Dimension } from "../../utils/dimension";
import { Indices } from "../../utils/indices";
import { Position } from "../../utils/position";
import { Building } from "./building";
import { BuildingType } from "../types/types";
import { FakeBuilding } from "./fakeBuilding";
import {
  gameState,
  globalState,
  infoPanel,
  initBuildingState,
  selectedBuilding,
} from "../../data/data";
import { GameStateEnum } from "../utils/gameStateEnum";
import { PointerEnum } from "../utils/pointerEnum";
import { GameMainMenuState } from "../../states/gameMenuState";

export class Builder {
  private buildings: Building[];
  private buildingPos: Position;

  private fakeHouse: FakeBuilding;
  private selectedHouse: Building;

  constructor() {
    this.buildings = [];

    this.fakeHouse = new FakeBuilding(
      new Indices(-1, -1),
      selectedBuilding.data
    );

    this.selectedHouse = new Building(
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
      gameState.state = GameStateEnum.build;
      this.fakeHouse.setPos(mousePos.sub(cameraScroll));
      this.fakeHouse.setBuilding(selectedBuilding.data);
    }
  }

  public handleClick(
    indices: Indices,
    mousePos: Position,
    cameraScroll: Position
  ): void {
    this.buildings.forEach((building) => {
      if (building.isMouseIntersect(mousePos.sub(cameraScroll))) {
        this.selectedHouse.setBuilding(building.getBuilding());
        infoPanel.data = building.getIndices();
        gameState.pointer = PointerEnum.House;
      }
    });

    if (gameState.state === GameStateEnum.build) {
      if (selectedBuilding.data.url.length) {
        ServerHandler.sendMessage("game:build", {
          indices,
          building: selectedBuilding.data,
          buildingPos: this.buildingPos,
        });
      }
    }

    if (gameState.state !== GameStateEnum.build) {
      switch (gameState.pointer) {
        case PointerEnum.Tile: {
          gameState.state = GameStateEnum.default;
          break;
        }
        case PointerEnum.House: {
          infoPanel.name = this.selectedHouse.getBuildingName();

          gameState.state = GameStateEnum.select;
          globalState.gameMenuState = GameMainMenuState.Info;
          break;
        }
      }
    }
  }

  public handleMouseMove(mousePos: Position, cameraScroll: Position): void {
    if (selectedBuilding.data.url.length) {
      const dimension: Dimension = this.fakeHouse.getDimension();

      const housePos: Position = new Position(
        this.buildingPos.x - dimension.width / 2,
        this.buildingPos.y - dimension.height
      );

      this.fakeHouse.setPos(housePos);
    }

    this.buildings.forEach((building) => {
      building.setHover(building.isMouseIntersect(mousePos.sub(cameraScroll)));
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

      this.resetStates();
    }
  }

  private resetStates(): void {
    selectedBuilding.data = { ...initBuildingState.data };
    this.fakeHouse.setBuilding(selectedBuilding.data);
    this.fakeHouse.setPos(new Position(-1000, -1000));
    gameState.state = GameStateEnum.default;
  }

  private destroy(indices: Indices): void {
    for (let i = this.buildings.length - 1; i >= 0; --i) {
      const buildingIndices = this.buildings[i].getIndices();

      if (buildingIndices.i === indices.i && buildingIndices.j === indices.j) {
        this.buildings.splice(i, 1);
      }
    }

    globalState.gameMenuState = GameMainMenuState.Unselected;
  }

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

    ServerHandler.receiveMessage("game:destroy", (indices: Indices) => {
      this.destroy(indices);
    });
  }
}
