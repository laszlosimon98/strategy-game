import { state } from "../../../../data/state";
import { UnitStates } from "../../../../enums/unitsState";
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
      new Position(
        this.renderPos.x + UNIT_SIZE.width / 2,
        this.renderPos.y + UNIT_SIZE.height - UNIT_SIZE.height / 4
      ),
      this.range,
      state.game.players[this.entity.data.owner].color
    );

    this.range = this.rangeIndicator.getRange();
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

  protected attack(myUnit: Soldier, opponentUnit: Soldier): void {
    if (myUnit.isTileReached() && opponentUnit.isTileReached()) {
      if (!this.attackTimer.isTimerActive()) {
        myUnit.setState(UnitStates.Attacking);
        opponentUnit.setState(UnitStates.Attacking);
        this.attackTimer.activate();
      }
    }
  }
}
