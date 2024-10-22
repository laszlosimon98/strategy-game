import { v4 as uuidv4 } from "uuid";

import { ServerHandler } from "../../../../server/serverHandler";
import { Indices } from "../../../../utils/indices";
import { Position } from "../../../../utils/position";
import { FakeBuilding } from "../fakeBuilding";
import { buildingRegister } from "../buildingRegister/buildingRegister";
import { initState, state } from "../../../../data/state";
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
    this.fakeHouse = new FakeBuilding(this.initObject(), false);
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
    if (state.navigation.gameMenuState === MainMenuState.Info) {
      state.navigation.gameMenuState = state.navigation.prevMenuState;
    }

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
    this.resetStates();
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

  private build(entity: EntityType): void {
    const name = getImageNameFromUrl(entity.data.url);

    const newBuilding: Building = this.creator<Building>(
      buildingRegister[name],
      entity
    );

    this.setObjectPosition(newBuilding, entity.data.position);
    state.game.players[entity.data.owner].buildings.push(newBuilding);
  }

  private setFakeHouse(): void {
    const entity: EntityType = {
      data: {
        ...initState.data,
        ...state.game.builder.data,
        position: this.pos,
        owner: ServerHandler.getId(),
        id: uuidv4(),
      },
    };

    this.fakeHouse.setBuilding(entity);
    this.setObjectPosition(this.fakeHouse, this.pos);
  }

  private destroy(id: string, indices: Indices): void {
    const buildings = state.game.players[id].buildings;

    for (let i = buildings.length - 1; i >= 0; --i) {
      const buildingIndices = buildings[i].getIndices();

      if (buildingIndices.i === indices.i && buildingIndices.j === indices.j) {
        buildings.splice(i, 1);
      }
    }
  }

  private resetStates(): void {
    state.game.builder.data = { ...initState.data };
    this.fakeHouse.setBuilding(initState);
  }

  private sendBuildRequest(indices: Indices): void {
    if (state.game.builder.data.url.length) {
      const entity: EntityType = {
        data: {
          ...state.game.builder.data,
          indices,
          owner: ServerHandler.getId(),
          position: this.pos,
          id: uuidv4(),
        },
      };

      ServerHandler.sendMessage("game:build", entity);
    }
  }

  protected handleCommunication(): void {
    ServerHandler.receiveMessage("game:build", (entity: EntityType) => {
      this.build(entity);
    });

    ServerHandler.receiveMessage(
      "game:destroy",
      ({ id, indices }: { id: string; indices: Indices }) => {
        this.destroy(id, indices);
      }
    );
  }
}
