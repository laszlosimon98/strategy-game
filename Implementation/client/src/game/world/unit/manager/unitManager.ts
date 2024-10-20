import { state } from "../../../../data/state";
import { Pointer } from "../../../../enums/pointer";
import { ServerHandler } from "../../../../server/serverHandler";
import { EntityType } from "../../../../types/gameType";
import { Dimension } from "../../../../utils/dimension";
import { Indices } from "../../../../utils/indices";
import { Position } from "../../../../utils/position";
import { Manager } from "../../manager/manager";
import { Unit } from "../unit";

export class UnitManager extends Manager<Unit> {
  public constructor() {
    super();
  }

  public draw(): void {
    super.draw("units");
  }

  public update(dt: number, cameraScroll: Position): void {
    super.update(dt, cameraScroll, "units");
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
    this.setObjectPosition(unit, this.pos);
    state.game.players[ServerHandler.getId()].units.push(unit);
  }

  public handleRightClick(...args: any[]): void {
    throw new Error("Method not implemented.");
  }

  public handleMouseMove(mousePos: Position, cameraScroll: Position): void {
    this.hoverObject(mousePos, cameraScroll, "units", Pointer.Unit);
  }

  protected handleCommunication(): void {}
}
