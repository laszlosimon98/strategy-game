import { ServerHandler } from "../../../../server/serverHandler";
import { Indices } from "../../../../utils/indices";
import { Position } from "../../../../utils/position";
import { FakeBuilding } from "../fakeBuilding";
import { buildingRegister } from "../register/buildingRegister";
import { initBuilding, state } from "../../../../data/state";
import { GameState } from "../../../../enums/gameState";
import { getImageNameFromUrl, isMouseIntersect } from "../../../../utils/utils";
import { Pointer } from "../../../../enums/pointer";
import { MainMenuState } from "../../../../enums/gameMenuState";
import { EntityType } from "../../../../types/gameType";
import { Manager } from "../../manager/manager";
import { Building } from "../building";

export class BuildingManager extends Manager<Building> {
  private fakeHouse: FakeBuilding;
  private selectedHouse: FakeBuilding;

  constructor() {
    super();
    this.fakeHouse = new FakeBuilding({
      data: {
        ...state.game.selectedBuilding.data,
        owner: ServerHandler.getId(),
      },
    });

    this.selectedHouse = new FakeBuilding({
      data: {
        ...state.game.selectedBuilding.data,
        owner: ServerHandler.getId(),
      },
    });
  }

  public draw(): void {
    Object.keys(state.game.players).forEach((key) => {
      state.game.players[key].buildings.forEach((building) => building.draw());
    });
    this.fakeHouse.draw();
  }

  public update(dt: number, cameraScroll: Position): void {
    Object.keys(state.game.players).forEach((key) => {
      state.game.players[key].buildings.forEach((building) =>
        building.update(dt, cameraScroll)
      );
    });
    this.fakeHouse.update(dt, cameraScroll);
  }

  public handleLeftClick(
    indices: Indices,
    mousePos: Position,
    cameraScroll: Position
  ): void {
    this.sendBuildRequest(indices);
    this.selectHouse(mousePos, cameraScroll);

    if (state.game.state !== GameState.Build) {
      switch (state.pointer.state) {
        case Pointer.House: {
          const selectedHouseName = this.selectedHouse.getBuildingName();
          if (selectedHouseName) {
            state.info.name = selectedHouseName;
            state.game.state = GameState.House;
            state.navigation.gameMenuState = MainMenuState.Info;
          }
          break;
        }
      }
      this.resetStates();
    }
  }

  handleMiddleClick(): void {}

  public handleRightClick(): void {
    this.resetStates();
  }

  public handleMouseMove(mousePos: Position, cameraScroll: Position): void {
    if (
      state.game.selectedBuilding.data.url.length &&
      !this.selectedHouse.getBuilding().data.url.length
    ) {
      this.setFakeHouse();
    }
    this.hoverHouse(mousePos, cameraScroll);
  }

  protected handleCommunication(): void {
    ServerHandler.receiveMessage(
      "game:build",
      ({
        building,
        buildingPos,
      }: {
        building: EntityType;
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

  private hoverHouse(mousePos: Position, cameraScroll: Position): void {
    if (
      state.pointer.state !== Pointer.Menu &&
      state.game.state !== GameState.Build
    ) {
      state.game.players[ServerHandler.getId()].buildings.forEach(
        (building) => {
          building.setHover(
            isMouseIntersect(mousePos.sub(cameraScroll), building)
          );
          state.pointer.state = Pointer.House;
        }
      );
    }
  }

  private selectHouse(mousePos: Position, cameraScroll: Position): void {
    if (state.pointer.state === Pointer.House) {
      state.game.players[ServerHandler.getId()].buildings.forEach(
        (building) => {
          if (isMouseIntersect(mousePos.sub(cameraScroll), building)) {
            this.selectedHouse.setBuilding(building.getBuilding());
            state.info.data = building.getIndices();

            state.game.selectedBuilding.data = {
              ...building.getBuilding().data,
            };
          }
        }
      );
    }
  }

  private build(building: EntityType, buildingPos: Position): void {
    const name = getImageNameFromUrl(building.data.url);

    const newBuilding: Building = this.creator(buildingRegister[name], {
      ...building,
    });

    this.setObject(newBuilding, buildingPos);
    state.game.players[building.data.owner].buildings.push(newBuilding);

    this.resetStates();
  }

  private setFakeHouse(): void {
    this.setObject(this.fakeHouse, this.pos);
    this.fakeHouse.setBuilding(state.game.selectedBuilding);
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
    this.resetStates();
  }

  private resetStates(): void {
    state.game.selectedBuilding.data = { ...initBuilding.data };
    this.selectedHouse.setBuilding(initBuilding);
    this.fakeHouse.setBuilding(initBuilding);
    this.fakeHouse.setPosition(new Position(-1000, -1000));
    state.game.state = GameState.Default;
  }

  private sendBuildRequest(indices: Indices): void {
    if (
      state.game.state === GameState.Build &&
      state.pointer.state === Pointer.Tile
    ) {
      if (state.game.selectedBuilding.data.url.length) {
        const selectedBuilding: EntityType = {
          data: {
            ...state.game.selectedBuilding.data,
            indices,
            owner: "",
          },
        };
        ServerHandler.sendMessage("game:build", {
          building: selectedBuilding,
          buildingPos: this.pos,
        });
      }
    }
  }
}
