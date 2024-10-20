import { MouseClicker } from "../../../interfaces/mouseClicker";
import { ChangeAble } from "../../../interfaces/changeAble";
import { RenderInterface } from "../../../interfaces/render";
import { Dimension } from "../../../utils/dimension";
import { Position } from "../../../utils/position";

export abstract class Manager<T> implements MouseClicker, RenderInterface {
  protected pos: Position;

  protected constructor() {
    this.pos = Position.zero();
    this.handleCommunication();
  }

  public abstract draw(): void;
  public abstract update(dt: number, ...args: any[]): void;

  public abstract handleLeftClick(...args: any[]): void;
  public abstract handleMiddleClick(...args: any[]): void;
  public abstract handleRightClick(...args: any[]): void;
  public abstract handleMouseMove(...args: any[]): void;

  protected abstract handleCommunication(): void;

  protected creator<K extends T>(
    Creator: new (...args: any[]) => K,
    ...args: ConstructorParameters<typeof Creator>
  ): K {
    return new Creator(...args);
  }

  public setPos(pos: Position): void {
    this.pos = pos;
  }

  protected setObject<T extends ChangeAble>(
    object: T,
    buildingPos: Position
  ): void {
    const dimension: Dimension = object.getDimension();
    const housePos: Position = new Position(
      buildingPos.x - dimension.width / 2,
      buildingPos.y - dimension.height
    );
    object.setPosition(housePos);
  }
}
