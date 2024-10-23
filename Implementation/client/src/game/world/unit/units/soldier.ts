import { EntityType } from "../../../../types/gameType";
import { Unit } from "../unit";

export abstract class Soldier extends Unit {
  constructor(entity: EntityType, name: string) {
    super(entity, name);
  }

  protected abstract attack(): void;
}
