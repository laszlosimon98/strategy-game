import { ObstacleEnum } from "@/enums/ObstacleEnum";
import { Building } from "@/game/building";
import { Soldier } from "@/game/units/soldier";
import { StateManager } from "@/manager/stateManager";
import { EntityType } from "@/types/state.types";
import { Socket } from "socket.io";

export class GuardHouse extends Building {
  public constructor(building: EntityType) {
    super(building);

    this.range = 30;
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

    const idSet: Set<string> = new Set(
      soldiers
        .map((soldier) => {
          if (soldier) {
            return soldier.getEntity().data.owner;
          }
        })
        .filter((owner): owner is string => owner !== undefined)
    );

    const idArray: string[] = Array.from(idSet);

    return idArray.length === 1 && idArray[1] !== this.getEntity().data.owner;
  }

  public capturingBy(socket: Socket, room: string): string | undefined {
    const soldiers: Soldier[] = StateManager.getWorldInRange(
      socket,
      this.getIndices(),
      this.occupationRange,
      ObstacleEnum.Unit,
      room
    ).map((cell) => cell.getSoldier() as Soldier);
    if (!soldiers) return;

    const enemySoldier = soldiers.find(
      (soldier) =>
        soldier.getEntity().data.owner !== this.getEntity().data.owner
    );

    return enemySoldier?.getEntity().data.owner;
  }
}
