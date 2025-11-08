import { ObstacleEnum } from "@/enums/ObstacleEnum";
import { Building } from "@/game/building";
import { Soldier } from "@/game/units/soldier";
import { StateManager } from "@/manager/stateManager";
import { EntityType } from "@/types/state.types";
import { Socket } from "socket.io";

export class GuardHouse extends Building {
  public constructor(building: EntityType) {
    super(building);

    this.range = 11;
    this.occupationRange = 2;
  }

  public isCapturable(socket: Socket, room: string): boolean {
    const soldiers: Soldier[] = StateManager.getWorldInRange(
      socket,
      this.getIndices(),
      this.occupationRange,
      ObstacleEnum.Unit,
      room
    ).map((cell) => cell.getSoldier() as Soldier);

    // TODO: mi van ha két különböző ellenség van a torony közelében, akkor se lehessen foglalni
    const hasEnemySoldier = soldiers.some(
      (soldier) =>
        soldier.getEntity().data.owner !== this.getEntity().data.owner
    );

    const hasOwnSoldier = soldiers.some(
      (soldier) =>
        soldier.getEntity().data.owner === this.getEntity().data.owner
    );

    return !hasOwnSoldier && hasEnemySoldier;
  }

  public capturingBy(socket: Socket, room: string): string | undefined {
    const soldiers: Soldier[] = StateManager.getWorldInRange(
      socket,
      this.getIndices(),
      this.occupationRange,
      ObstacleEnum.Unit,
      room
    ).map((cell) => cell.getSoldier() as Soldier);

    // TODO: mi van ha két különböző ellenség van a torony közelében, akkor se lehessen foglalni
    const enemySoldier = soldiers.find(
      (soldier) =>
        soldier.getEntity().data.owner !== this.getEntity().data.owner
    );

    return enemySoldier?.getEntity().data.owner;
  }
}
