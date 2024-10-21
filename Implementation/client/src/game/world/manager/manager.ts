import { MouseClicker } from "../../../interfaces/mouseClicker";
import { CallAble } from "../../../interfaces/callAble";
import { Dimension } from "../../../utils/dimension";
import { Position } from "../../../utils/position";
import { initState, state } from "../../../data/state";
import { GameState } from "../../../enums/gameState";
import { ServerHandler } from "../../../server/serverHandler";
import { isMouseIntersect } from "../../../utils/utils";
import { MainMenuState } from "../../../enums/gameMenuState";
import { Building } from "../building/building";
import { Unit } from "@faker-js/faker";
import { EntityType } from "../../../types/gameType";
import { Tile } from "../tile";

export abstract class Manager<T> implements MouseClicker {
  protected pos: Position;
  protected world: Tile[][];

  protected constructor() {
    this.pos = Position.zero();
    this.world = [];
    this.handleCommunication();
  }

  public abstract handleLeftClick(...args: any[]): void;
  public abstract handleMiddleClick(...args: any[]): void;
  public abstract handleRightClick(...args: any[]): void;
  public abstract handleMouseMove(...args: any[]): void;

  protected abstract handleCommunication(): void;

  protected draw<T extends CallAble>(objectKey: string): void {
    Object.keys(state.game.players).forEach((key) => {
      const arr: T[] = state.game.players[key][objectKey] as unknown as T[];
      arr.forEach((object) => object.draw());
    });
  }

  protected update<T extends CallAble>(
    dt: number,
    cameraScroll: Position,
    objectKey: string
  ): void {
    Object.keys(state.game.players).forEach((key) => {
      const arr: T[] = state.game.players[key][objectKey] as unknown as T[];
      arr.forEach((object) => object.update(dt, cameraScroll));
    });
  }

  public setWorld(world: Tile[][]): void {
    this.world = world;
  }

  protected creator<K extends T>(
    Creator: new (...args: any[]) => K,
    ...args: ConstructorParameters<typeof Creator>
  ): K {
    return new Creator(...args);
  }

  public setPos(pos: Position): void {
    this.pos = pos;
  }

  protected initObject(): EntityType {
    return {
      data: {
        ...initState.data,
        owner: ServerHandler.getId(),
      },
    };
  }

  protected setObjectPosition<T extends CallAble>(
    object: T,
    objectPos: Position
  ): void {
    const dimension: Dimension = object.getDimension();
    const newObjectPos: Position = new Position(
      objectPos.x - dimension.width / 2,
      objectPos.y - dimension.height
    );
    object.setPosition(newObjectPos);
  }

  protected hoverObject<T extends CallAble>(
    mousePos: Position,
    cameraScroll: Position,
    key: string
  ): void {
    if (state.game.state !== GameState.Build) {
      const objectArray: T[] = state.game.players[ServerHandler.getId()][
        key
      ] as unknown as T[];

      objectArray.forEach((object) => {
        object.setHover(isMouseIntersect(mousePos.sub(cameraScroll), object));
      });
    }
  }

  protected selectObject<T extends Building & Unit>(
    mousePos: Position,
    cameraScroll: Position,
    key: string
  ): T | undefined {
    const objectArray: T[] = state.game.players[ServerHandler.getId()][
      key
    ] as unknown as T[];

    const selectedObject = objectArray.find((object) => {
      if (isMouseIntersect(mousePos.sub(cameraScroll), object)) {
        return object;
      }
    });

    if (selectedObject) {
      state.infoPanel.data = selectedObject;
      state.game.state = GameState.Selected;
      state.navigation.prevMenuState = state.navigation.gameMenuState;
      state.navigation.gameMenuState = MainMenuState.Info;
    } else {
      state.game.state = GameState.Default;
    }

    return selectedObject;
  }
}
