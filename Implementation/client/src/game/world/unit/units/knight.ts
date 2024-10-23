import { EntityType } from "../../../../types/gameType";
import { Soldier } from "./soldier";

export class Knight extends Soldier {
  // private range: number;

  constructor(entity: EntityType, name: string) {
    super(entity, name);
  }

  protected attack(): void {
    throw new Error("Method not implemented.");
  }
}
