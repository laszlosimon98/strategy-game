import { MouseClicker } from "../../../interfaces/mouseClicker";
import { CallAble } from "../../../interfaces/callAble";
import { Dimension } from "../../../utils/dimension";
import { Position } from "../../../utils/position";
import { state } from "../../../data/state";
import { GameState } from "../../../enums/gameState";
import { Pointer } from "../../../enums/pointer";
import { ServerHandler } from "../../../server/serverHandler";
import { isMouseIntersect } from "../../../utils/utils";

export abstract class Manager<T> implements MouseClicker {
  protected pos: Position;
  // protected selectedObject: T;

  protected constructor() {
    this.pos = Position.zero();
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

  protected creator<K extends T>(
    Creator: new (...args: any[]) => K,
    ...args: ConstructorParameters<typeof Creator>
  ): K {
    return new Creator(...args);
  }

  public setPos(pos: Position): void {
    this.pos = pos;
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
    key: string,
    stateTo: Pointer
  ): void {
    if (
      state.pointer.state !== Pointer.Menu &&
      state.game.state !== GameState.Build
    ) {
      const objectArray: T[] = state.game.players[ServerHandler.getId()][
        key
      ] as unknown as T[];

      objectArray.forEach((object) => {
        object.setHover(isMouseIntersect(mousePos.sub(cameraScroll), object));
        state.pointer.state = stateTo;
      });
    }
  }
}
