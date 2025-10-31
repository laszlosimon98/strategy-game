import { Indices } from "@/utils/indices";
import { StateManager } from "@/manager/stateManager";
import type { Position } from "@/types/utils.types";
import type { EntityType } from "@/types/state.types";
import { Entity } from "@/game/entities/entity";

export class Unit extends Entity {
  public constructor(entity: EntityType) {
    super(entity);
  }
}
