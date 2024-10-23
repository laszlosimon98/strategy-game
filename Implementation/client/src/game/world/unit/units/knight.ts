import { state } from "../../../../data/state";
import { UNIT_SIZE } from "../../../../settings";
import { EntityType } from "../../../../types/gameType";
import { Position } from "../../../../utils/position";
import { RangeIndicator } from "../../../../utils/rangeIndicator";
import { Soldier } from "./soldier";

export class Knight extends Soldier {
  private rangeIndicator: RangeIndicator;

  constructor(entity: EntityType, name: string) {
    super(entity, name);
    this.range = 1.5;
    this.damage = 10;
    this.health = 100;

    this.rangeIndicator = new RangeIndicator(
      this.range,
      state.game.players[this.entity.data.owner].color
    );
    console.log(this.rangeIndicator);
  }

  public draw(): void {
    this.rangeIndicator.draw();
    super.draw();
  }

  public update(dt: number, cameraPos: Position): void {
    super.update(dt, cameraPos);

    this.rangeIndicator.update(
      new Position(
        this.renderPos.x + UNIT_SIZE.width / 2,
        this.renderPos.y + UNIT_SIZE.height - UNIT_SIZE.height / 4
      )
    );
  }

  protected attack(): void {
    throw new Error("Method not implemented.");
  }
}
