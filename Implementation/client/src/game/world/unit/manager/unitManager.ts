import { state } from "../../../../data/state";
import { ServerHandler } from "../../../../server/serverHandler";
import { EntityType } from "../../../../types/gameType";
import { Dimension } from "../../../../utils/dimension";
import { Indices } from "../../../../utils/indices";
import { Position } from "../../../../utils/position";
import { Manager } from "../../manager/manager";
import { Unit } from "../unit";

export class UnitManager extends Manager<Unit> {
  private units: Unit[];

  public constructor() {
    super();
    this.units = [];
  }

  public draw(): void {
    this.units.forEach((unit) => unit.draw());
  }

  public update(dt: number, cameraScroll: Position): void {
    this.units.forEach((unit) => unit.update(dt, cameraScroll));
  }

  public handleLeftClick(...args: any[]): void {
    throw new Error("Method not implemented.");
  }

  public handleMiddleClick(
    indices: Indices,
    mousePos: Position,
    cameraScroll: Position
  ): void {
    const color: string = state.game.players[ServerHandler.getId()].color;
    const unitEntity: EntityType = {
      data: {
        dimensions: new Dimension(64, 64),
        indices,
        owner: "",
        url: `http://localhost:3000/assets/colors/${color}/soldieridle.png`,
      },
    };
    const unit: Unit = this.creator(Unit, unitEntity);
    this.setObject(unit, this.pos);
    this.units.push(unit);
  }

  public handleRightClick(...args: any[]): void {
    throw new Error("Method not implemented.");
  }
  public handleMouseMove(...args: any[]): void {
    throw new Error("Method not implemented.");
  }

  protected handleCommunication(): void {}
}
