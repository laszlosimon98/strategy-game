import { playersFromState, gameStatus } from "@/src/game/data/state";
import { GameStatus } from "@/src/game/enums/game-status";
import { CallAble } from "@/src/game/interfaces/callable";
import { MouseClicker } from "@/src/game/interfaces/mouse-clicker";
import { Dimension } from "@/src/game/utils/dimension";
import { Position } from "@/src/game/utils/position";
import { isMouseIntersect } from "@/src/game/utils/utils";
import { Building } from "@/src/game/world/building/building";
import { Cell } from "@/src/game/world/cell";
import { ServerHandler } from "@/src/server/server-handler";
import { initEntity, setGameState } from "@/src/services/slices/game.slice";
import { dispatch } from "@/src/services/store";
import { EntityType } from "@/src/services/types/game.types";
import { Unit } from "@faker-js/faker";

export abstract class Manager<T> implements MouseClicker {
  protected pos: Position;
  protected world: Cell[][];

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
    Object.keys(playersFromState).forEach((key) => {
      const arr: T[] = playersFromState[key][objectKey] as unknown as T[];
      arr.forEach((object) => object.draw());
    });
  }

  protected update<T extends CallAble>(
    dt: number,
    cameraScroll: Position,
    objectKey: string
  ): void {
    Object.keys(playersFromState).forEach((key) => {
      const arr: T[] = playersFromState[key][objectKey] as unknown as T[];
      arr.forEach((object) => object.update(dt, cameraScroll));
    });
  }

  public setWorld(world: Cell[][]): void {
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
        ...initEntity.data,
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
    if (gameStatus !== GameStatus.Build) {
      const objectArray: T[] = playersFromState[ServerHandler.getId()][
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
    const objectArray: T[] = playersFromState[ServerHandler.getId()][
      key
    ] as unknown as T[];

    const selectedObject = objectArray.find((object) => {
      if (isMouseIntersect(mousePos.sub(cameraScroll), object)) {
        return object;
      }
    });

    if (selectedObject) {
      dispatch(setGameState(GameStatus.Selected));
    } else {
      dispatch(setGameState(GameStatus.Default));
    }

    return selectedObject;
  }
}
