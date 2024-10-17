import { ServerHandler } from "../../server/serverHandler";
import { Dimension } from "../../utils/dimension";
import { Indices } from "../../utils/indices";
import { Position } from "../../utils/position";
import { Building } from "./building";
import { FakeBuilding } from "./buildings/fakeBuilding";
import { buildingList } from "./buildings/buildingList";
import { initBuilding, state } from "../../data/state";
import { GameState } from "../../enums/gameState";
import { isMouseIntersect } from "../../utils/utils";
import { Pointer } from "../../enums/pointer";
import { MainMenuState } from "../../enums/gameMenuState";
import { BuildingType } from "../../types/gameType";

export class Builder {
  private buildingPos: Position;
  private fakeHouse: FakeBuilding;
  private selectedHouse: Building;

  constructor() {
    this.fakeHouse = new FakeBuilding(state.game.selectedBuilding);
    this.selectedHouse = new Building(state.game.selectedBuilding);
    this.buildingPos = Position.zero();

    this.handleCommunication();
  }

  public setBuildingPos(buildingPos: Position): void {
    this.buildingPos = buildingPos;
  }

  public draw(): void {
    Object.keys(state.game.players).forEach((key) => {
      state.game.players[key].buildings.forEach((building) => building.draw());
    });

    this.fakeHouse.draw();
  }

  public update(dt: number, mousePos: Position, cameraScroll: Position): void {
    Object.keys(state.game.players).forEach((key) => {
      state.game.players[key].buildings.forEach((building) =>
        building.update(dt, cameraScroll)
      );
    });

    this.fakeHouse.update(dt, cameraScroll);

    if (!state.game.selectedBuilding.data.url.length) {
      this.resetStates();
    }
  }

  public handleClick(
    indices: Indices,
    mousePos: Position,
    cameraScroll: Position
  ): void {
    this.selectHouse(mousePos, cameraScroll);

    if (state.game.state === GameState.build) {
      if (state.game.selectedBuilding.data.url.length) {
        const selectedBuilding: BuildingType = {
          data: {
            ...state.game.selectedBuilding.data,
            indices,
            owner: "",
          },
        };
        ServerHandler.sendMessage("game:build", {
          building: selectedBuilding,
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
          break;
        }
      }
    }
  }

  public handleMouseMove(mousePos: Position, cameraScroll: Position): void {
    if (state.game.selectedBuilding.data.url.length) {
      this.setFakeHouse();
    }

    if (
      state.pointer.state !== Pointer.Menu &&
      state.game.state !== GameState.build
    ) {
      state.game.players[ServerHandler.getId()].buildings.forEach(
        (building) => {
          building.setHover(
            isMouseIntersect(mousePos.sub(cameraScroll), building)
          );
        }
      );
    }
  }

  private setFakeHouse(): void {
    const dimension: Dimension = this.fakeHouse.getDimension();

    const housePos: Position = new Position(
      this.buildingPos.x - dimension.width / 2,
      this.buildingPos.y - dimension.height
    );

    state.game.state = GameState.build;
    this.fakeHouse.setPosition(housePos);
    this.fakeHouse.setBuilding(state.game.selectedBuilding);
  }

  private selectHouse(mousePos: Position, cameraScroll: Position): void {
    state.game.players[ServerHandler.getId()].buildings.forEach((building) => {
      if (isMouseIntersect(mousePos.sub(cameraScroll), building)) {
        this.selectedHouse.setBuilding(building.getBuilding());
        state.info.data = building.getIndices();
        state.pointer.state = Pointer.House;
      }
    });
  }

  private build(building: BuildingType, buildingPos: Position): void {
    const name = building.data.url.split("/")[6].split(".")[0];

    const newBuilding: Building = this.createBuilding(
      buildingList[name],
      building
    );

    const dimension: Dimension = newBuilding.getDimension();

    const housePos: Position = new Position(
      buildingPos.x - dimension.width / 2,
      buildingPos.y - dimension.height
    );

    newBuilding.setPosition(housePos);
    state.game.players[building.data.owner].buildings.push(newBuilding);

    this.resetStates();
  }

  private createBuilding<T extends Building>(
    CreatedBuilding: new (...args: any[]) => T,
    ...args: ConstructorParameters<typeof CreatedBuilding>
  ): T {
    return new CreatedBuilding(...args);
  }

  private destroy(id: string, indices: Indices): void {
    const buildings = state.game.players[id].buildings;

    for (let i = buildings.length - 1; i >= 0; --i) {
      const buildingIndices = buildings[i].getIndices();

      if (buildingIndices.i === indices.i && buildingIndices.j === indices.j) {
        buildings.splice(i, 1);
      }
    }

    state.navigation.gameMenuState = MainMenuState.Unselected;
  }

  private resetStates(): void {
    state.game.selectedBuilding.data = { ...initBuilding.data };
    this.fakeHouse.setBuilding(state.game.selectedBuilding);
    this.fakeHouse.setPosition(new Position(-1000, -1000));
    state.game.state = GameState.default;
  }

  private handleCommunication(): void {
    ServerHandler.receiveMessage(
      "game:build",
      ({
        building,
        buildingPos,
      }: {
        building: BuildingType;
        buildingPos: Position;
      }) => {
        this.build(building, buildingPos);
      }
    );

    ServerHandler.receiveMessage(
      "game:destroy",
      ({ id, indices }: { id: string; indices: Indices }) => {
        this.destroy(id, indices);
      }
    );
  }
}
