import { ObstacleEnum } from "@/enums/ObstacleEnum";
import { Building } from "@/game/buildings/building";
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
    )
      .map((cell) => cell.getSoldier())
      .filter(
        (soldier): soldier is Soldier =>
          soldier !== null && soldier !== undefined
      );

    if (soldiers.length === 0) return false;

    const idSet: Set<string> = new Set(
      soldiers
        .map((soldier) => {
          const entity = soldier?.getEntity();
          return entity?.data?.owner;
        })
        .filter(
          (owner): owner is string => owner !== undefined && owner !== null
        )
    );

    const idArray: string[] = Array.from(idSet);
    const buildingOwner = this.getEntity()?.data?.owner;

    return idArray.length === 1 && idArray[0] !== buildingOwner;
  }

  public capturingBy(socket: Socket, room: string): string | undefined {
    const soldiers: Soldier[] = StateManager.getWorldInRange(
      socket,
      this.getIndices(),
      this.occupationRange,
      ObstacleEnum.Unit,
      room
    )
      .map((cell) => cell.getSoldier())
      .filter(
        (soldier): soldier is Soldier =>
          soldier !== null && soldier !== undefined
      );

    if (soldiers.length === 0) return undefined;

    const enemySoldier = soldiers.find((soldier) => {
      const entity = soldier?.getEntity();
      const soldierOwner = entity?.data?.owner;
      const buildingOwner = this.getEntity()?.data?.owner;

      return soldierOwner && buildingOwner && soldierOwner !== buildingOwner;
    });

    return enemySoldier?.getEntity()?.data?.owner;
  }
}
