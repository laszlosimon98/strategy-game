import { gameStatus, playersFromState, builder } from "@/src/game/data/state";
import { GameStatus } from "@/src/game/enums/gameStatus";
import { Indices } from "@/src/game/utils/indices";
import { Position } from "@/src/game/utils/position";
import { getImageNameFromUrl } from "@/src/game/utils/utils";
import { Building } from "@/src/game/world/building/building";
import { buildingRegister } from "@/src/game/world/building/buildingRegister/buildingRegister";
import { FakeBuilding } from "@/src/game/world/building/fakeBuilding";
import { Manager } from "@/src/game/world/manager/manager";
import { ServerHandler } from "@/src/server/serverHandler";
import {
  addBuilding,
  resetBuilder,
  initEntity,
} from "@/src/services/slices/gameSlice";
import { getState, dispatch } from "@/src/services/store";
import { EntityType } from "@/src/services/types/gameTypes";
import { v4 as uuidv4 } from "uuid";

export class BuildingManager extends Manager<Building> {
  private fakeHouse: FakeBuilding;
  private builder: EntityType;

  constructor() {
    super();
    this.fakeHouse = new FakeBuilding(this.initObject(), false);
    this.builder = this.initObject();

    getState(
      (state) => state.game.data.builder.selectedHouse,
      (value) => {
        this.builder.data = {
          ...this.builder.data,
          ...value,
        };
      }
    );
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
    switch (gameStatus) {
      case GameStatus.Default: {
        this.selectObject(mousePos, cameraScroll, "buildings");
        break;
      }
      case GameStatus.Build: {
        this.sendBuildRequest(indices);
        break;
      }
      case GameStatus.Selected: {
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
    if (this.builder.data.url.length) {
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

    dispatch(addBuilding({ id: entity.data.owner, building: newBuilding }));
    console.log(playersFromState);
    // ySort(playersFromState[entity.data.owner].buildings);
  }

  private setFakeHouse(): void {
    const entity: EntityType = {
      data: {
        ...this.builder.data,
        position: this.pos,
        id: uuidv4(),
      },
    };

    this.builder.data = {
      ...this.builder.data,
      position: this.pos,
      id: uuidv4(),
    };

    this.fakeHouse.setBuilding(entity);
    this.setObjectPosition(this.fakeHouse, this.pos);
  }

  private destroy(id: string, indices: Indices): void {
    const buildings = playersFromState[id].buildings;

    for (let i = buildings.length - 1; i >= 0; --i) {
      const buildingIndices = buildings[i].getIndices();

      if (buildingIndices.i === indices.i && buildingIndices.j === indices.j) {
        buildings.splice(i, 1);
      }
    }
  }

  private resetStates(): void {
    dispatch(resetBuilder());
    this.fakeHouse.setBuilding(initEntity);
  }

  private sendBuildRequest(indices: Indices): void {
    if (builder.selectedHouse.url.length) {
      const entity: EntityType = {
        data: {
          ...builder.selectedHouse,
          static: "",
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
    ServerHandler.receiveMessage("game:build", (newBuilding: EntityType) => {
      console.log("build");
      this.build(newBuilding);
    });

    ServerHandler.receiveMessage(
      "game:destroy",
      ({ id, indices }: { id: string; indices: Indices }) => {
        this.destroy(id, indices);
      }
    );
  }
}
