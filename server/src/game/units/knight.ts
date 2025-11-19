import { Soldier } from "@/game/units/soldier";
import { EntityType } from "@/types/state.types";
import { Socket } from "socket.io";

export class Knight extends Soldier {
  public constructor(entity: EntityType, socket: Socket) {
    super(entity, socket);

    this.damage = 13;
    this.health = 100;
    this.range = 1;
  }
}
