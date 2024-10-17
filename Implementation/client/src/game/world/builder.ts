import { ServerHandler } from "../../server/serverHandler";
import { Dimension } from "../../utils/dimension";
import { Indices } from "../../utils/indices";
import { Position } from "../../utils/position";
import { Building } from "./building";
import { FakeBuilding } from "./buildings/fakeBuilding";
import { buildingList } from "./buildings/buildingList";
import { initBuildingState, state } from "../../data/state";
import { GameState } from "../../enums/gameState";
import { isMouseIntersect } from "../../utils/utils";
import { Pointer } from "../../enums/pointer";
import { MainMenuState } from "../../enums/gameMenuState";
import { BuildingAssetType } from "../../types/gameType";

export class Builder {
  private buildings: Building[];
  private buildingPos: Position;

  private fakeHouse: FakeBuilding;
  private selectedHouse: Building;

  constructor() {
    this.buildings = [];

    this.fakeHouse = new FakeBuilding(
      new Indices(-1, -1),
      state.building.selected.data
    );

    this.selectedHouse = new Building(
      new Indices(-1, -1),
      state.building.selected.data
    );

    this.buildingPos = Position.zero();

    this.handleCommunication();
  }

  public setBuildingPos(buildingPos: Position): void {
    this.buildingPos = buildingPos;
  }

  public draw(): void {
    this.buildings.forEach((building) => building.draw());
    this.fakeHouse.draw();
  }

  public update(dt: number, mousePos: Position, cameraScroll: Position): void {
    this.buildings.forEach((building) => building.update(dt, cameraScroll));
    this.fakeHouse.update(dt, cameraScroll);

    if (
      !state.building.selected.data.url.length &&
      this.fakeHouse.getBuilding().url
    ) {
      this.resetStates();
    }

    if (state.building.selected.data.url !== this.fakeHouse.getBuilding().url) {
      state.game.state = GameState.build;
      this.fakeHouse.setPosition(mousePos.sub(cameraScroll));
      this.fakeHouse.setBuilding(state.building.selected.data);
    }
  }

  public handleClick(
    indices: Indices,
    mousePos: Position,
    cameraScroll: Position
  ): void {
    this.buildings.forEach((building) => {
      if (isMouseIntersect(mousePos.sub(cameraScroll), building)) {
        this.selectedHouse.setBuilding(building.getBuilding());
        state.info.data = building.getIndices();
        state.pointer.state = Pointer.House;
      }
    });

    if (state.game.state === GameState.build) {
      if (state.building.selected.data.url.length) {
        ServerHandler.sendMessage("game:build", {
          indices,
          building: state.building.selected.data,
          buildingPos: this.buildingPos,
        });
      }
    }

    if (state.game.state !== GameState.build) {
      switch (state.pointer.state) {
        case Pointer.Tile: {
          state.game.state = GameState.default;
          break;
        }
        case Pointer.House: {
          state.info.name = this.selectedHouse.getBuildingName();

          state.game.state = GameState.select;
          state.navigation.gameMenuState = MainMenuState.Info;

          this.buildings.forEach((building) => building.action());
          break;
        }
      }
    }
  }

  public handleMouseMove(mousePos: Position, cameraScroll: Position): void {
    if (state.building.selected.data.url.length) {
      this.createHouseHolder();
    }

    if (
      state.pointer.state !== Pointer.Menu &&
      state.game.state !== GameState.build
    ) {
      this.buildings.forEach((building) => {
        building.setHover(
          isMouseIntersect(mousePos.sub(cameraScroll), building)
        );
      });
    }
  }

  private createHouseHolder(): void {
    const dimension: Dimension = this.fakeHouse.getDimension();

    const housePos: Position = new Position(
      this.buildingPos.x - dimension.width / 2,
      this.buildingPos.y - dimension.height
    );

    this.fakeHouse.setPosition(housePos);
  }

  private build(
    indices: Indices,
    building: BuildingAssetType,
    buildingPos: Position
  ): void {
    if (building) {
      const i = indices.i;
      const j = indices.j;

      const name = building.url.split("/")[6].split(".")[0];
      const newBuilding: Building = this.createBuilding(
        buildingList[name],
        new Indices(i, j),
        building
      );
      const dimension: Dimension = newBuilding.getDimension();

      const housePos: Position = new Position(
        buildingPos.x - dimension.width / 2,
        buildingPos.y - dimension.height
      );

      newBuilding.setPosition(housePos);
      this.buildings.push(newBuilding);

      this.resetStates();
    }
  }

  private createBuilding<T extends Building>(
    CreatedBuilding: new (...args: any[]) => T,
    ...args: ConstructorParameters<typeof CreatedBuilding>
  ): T {
    return new CreatedBuilding(...args);
  }

  private resetStates(): void {
    state.building.selected.data = { ...initBuildingState.data };
    this.fakeHouse.setBuilding(state.building.selected.data);
    this.fakeHouse.setPosition(new Position(-1000, -1000));
    state.game.state = GameState.default;
  }

  private destroy(indices: Indices): void {
    for (let i = this.buildings.length - 1; i >= 0; --i) {
      const buildingIndices = this.buildings[i].getIndices();

      if (buildingIndices.i === indices.i && buildingIndices.j === indices.j) {
        this.buildings.splice(i, 1);
      }
    }

    state.navigation.gameMenuState = MainMenuState.Unselected;
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
        building: BuildingAssetType;
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
