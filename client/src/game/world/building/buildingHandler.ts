import { v4 as uuidv4 } from "uuid";

import { MainMenuState } from "@/enums/gameMenuState";
import { GameState } from "@/enums/gameState";
import { Building } from "@/game/world/building/building";
import { FakeBuilding } from "@/game/world/building/fakeBuilding";
import { Manager } from "@/game/world/manager";
import { ServerHandler } from "@/server/serverHandler";
import type { EntityType } from "@/types/game.types";
import { Indices } from "@/utils/indices";
import { Position } from "@/utils/position";
import { convertIsometricCoordsToCartesianCoords, ySort } from "@/utils/utils";
import { StateManager } from "@/manager/stateManager";
import type { Cell } from "@/game/world/cell";

export class BuildingHandler extends Manager {
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
    if (StateManager.getGameMenuState() === MainMenuState.Info) {
      StateManager.setGameMenuState(StateManager.getPrevMenuState());
    }

    switch (StateManager.getState()) {
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
    if (StateManager.getBuilder().data.url.length) {
      this.setFakeHouse(mousePos, cameraScroll);
    }
    this.hoverObject(mousePos, cameraScroll, "buildings");
  }

  protected handleCommunication(): void {
    ServerHandler.receiveMessage("game:build", (entity: EntityType) => {
      this.build(entity);
    });

    ServerHandler.receiveMessage(
      "game:destroy",
      ({ entity }: { entity: EntityType }) => {
        this.destroy(entity);
      }
    );

    ServerHandler.receiveMessage(
      "game:destroyLostTerritoryBuildings",
      ({ entities }: { entities: EntityType[] }) => {
        entities.forEach((entity) => this.destroy(entity));
      }
    );
  }

  private build(entity: EntityType): void {
    const newBuilding: Building = this.creator<Building>(Building, entity);
    const { i, j } = entity.data.indices;

    this.setObjectPosition(newBuilding, entity.data.position);
    StateManager.createBuilding(entity, newBuilding);
    StateManager.getWorld()[i][j].setObstacle(true);

    ySort(StateManager.getBuildings(entity.data.owner));
  }

  private setFakeHouse(mousePos: Position, cameraScroll: Position): void {
    const indices: Indices = convertIsometricCoordsToCartesianCoords(
      mousePos,
      cameraScroll
    );

    const entity: EntityType = {
      data: {
        ...StateManager.getBuilder().data,
        position: this.pos,
        owner: ServerHandler.getId(),
        id: uuidv4(),
        indices,
      },
    };

    const world: Cell[][] = StateManager.getWorld();
    const { i, j } = indices;

    if (world[i][j].getOwner() === entity.data.owner && world[i][j].isEmpty()) {
      this.fakeHouse.setBuilding(entity);
      this.setObjectPosition(this.fakeHouse, this.pos);
    }
  }

  private destroy(entity: EntityType): void {
    const { i, j } = entity.data.indices;

    StateManager.destroyBuilding(entity);
    StateManager.getWorld()[i][j].setObstacle(false);
  }

  private resetStates(): void {
    StateManager.resetBuilder();
    this.fakeHouse.setBuilding(StateManager.getInitData());
  }

  private sendBuildRequest(indices: Indices): void {
    if (StateManager.getBuilder().data.url.length) {
      const entity: EntityType = {
        data: {
          ...StateManager.getBuilder().data,
          indices,
          owner: ServerHandler.getId(),
          position: this.pos,
          id: uuidv4(),
        },
      };

      ServerHandler.sendMessage("game:build", entity);
    }
  }
}
