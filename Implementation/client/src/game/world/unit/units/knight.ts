import { UnitStates } from "../../../../enums/unitsState";
import { EntityType, SoldierPropertiesType } from "../../../../types/gameType";
import { Position } from "../../../../utils/position";
import { Soldier } from "./soldier";

export class Knight extends Soldier {
  constructor(
    entity: EntityType,
    name: string,
    propterties: SoldierPropertiesType
  ) {
    super(entity, name, propterties);
  }

  public draw(): void {
    super.draw();
  }

  public update(dt: number, cameraPos: Position): void {
    super.update(dt, cameraPos);
  }

  protected attack(unit1: Soldier, unit2: Soldier): void {
    // if (myUnit.isCellReached() && opponentUnit.isCellReached()) {
    if (!this.attackTimer.isTimerActive()) {
      console.log(unit1, unit2);
      console.log("attack");
      unit1.setState(UnitStates.Attacking);
      unit2.setState(UnitStates.Attacking);
      this.attackTimer.activate();
    }
    // }
  }

  protected stopAttack(myUnit: Soldier, opponentUnit: Soldier): void {}
}
