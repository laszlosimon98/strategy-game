import { ServerHandler } from "../../../../server/serverHandler";
import { Indices } from "../../../../utils/indices";
import { Position } from "../../../../utils/position";
import { FakeBuilding } from "../fakeBuilding";
import { buildingRegister } from "../register/buildingRegister";
import { initBuilding, state } from "../../../../data/state";
import { GameState } from "../../../../enums/gameState";
import { getImageNameFromUrl } from "../../../../utils/utils";
import { MainMenuState } from "../../../../enums/gameMenuState";
import { EntityType } from "../../../../types/gameType";
import { Manager } from "../../manager/manager";
import { Building } from "../building";

export class BuildingManager extends Manager<Building> {
  private fakeHouse: FakeBuilding;

  constructor() {
    super();
    this.fakeHouse = new FakeBuilding(this.initObject());
  }

  public draw(): void {
    super.draw("buildings");
    this.fakeHouse.draw();
  }

  public update(dt: number, cameraScroll: Position): void {
    super.update(dt, cameraScroll, "buildings");
    this.fakeHouse.update(dt, cameraScroll);
  }

  public handleLeftClick(
    indices: Indices,
    mousePos: Position,
    cameraScroll: Position
  ): void {
    switch (state.game.state) {
      case GameState.Default: {
        this.selectObject(mousePos, cameraScroll, "buildings");
        break;
      }
      case GameState.Build: {
        this.sendBuildRequest(indices);
        break;
      }
      case GameState.Selected: {
        this.selectObject(mousePos, cameraScroll, "buildings");
        break;
      }
    }
  }

  handleMiddleClick(): void {}

  public handleRightClick(): void {
    this.resetStates();
  }

  public handleMouseMove(mousePos: Position, cameraScroll: Position): void {
    if (state.game.builder.data.url.length) {
      this.setFakeHouse();
    }
    this.hoverObject(mousePos, cameraScroll, "buildings");
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

  private build(building: EntityType, buildingPos: Position): void {
    const name = getImageNameFromUrl(building.data.url);

    const newBuilding: Building = this.creator(buildingRegister[name], {
      ...building,
    });

    this.setObjectPosition(newBuilding, buildingPos);
    state.game.players[building.data.owner].buildings.push(newBuilding);

    this.resetStates();
  }

  private setFakeHouse(): void {
    this.setObjectPosition(this.fakeHouse, this.pos);
    this.fakeHouse.setBuilding(state.game.builder);
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
    state.game.builder.data = { ...initBuilding.data };
    this.fakeHouse.setBuilding(initBuilding);
    this.fakeHouse.setPosition(new Position(-1000, -1000));
    state.game.state = GameState.Default;
  }

  private sendBuildRequest(indices: Indices): void {
    if (state.game.builder.data.url.length) {
      const builder: EntityType = {
        data: {
          ...state.game.builder.data,
          indices,
          owner: "",
        },
      };
      ServerHandler.sendMessage("game:build", {
        building: builder,
        buildingPos: this.pos,
      });
    }
  }
}
