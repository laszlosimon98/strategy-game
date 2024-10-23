import { EntityType } from "../../../../types/gameType";
import { Position } from "../../../../utils/position";
import { Unit } from "../unit";

export abstract class Soldier extends Unit {
  protected range: number = 0;
  protected health: number = 0;
  protected damage: number = 0;

  constructor(entity: EntityType, name: string) {
    super(entity, name);
  }

  public draw(): void {
    super.draw();
  }

  public update(dt: number, cameraPos: Position): void {
    super.update(dt, cameraPos);
  }

  protected abstract attack(): void;
}
