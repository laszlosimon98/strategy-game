import { Soldier } from "@/game/units/soldier";
import { EntityType } from "@/types/state.types";
import { Socket } from "socket.io";

/**
 * Ijász osztály
 */
export class Archer extends Soldier {
  public constructor(entity: EntityType, socket: Socket) {
    super(entity, socket);

    this.damage = 9;
    this.health = 75;
    this.range = 5;
  }
}
