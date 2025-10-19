import { CellTypeEnum } from "@/enums/cellTypeEnum";
import { Cell } from "@/game/cell";
import { Production } from "@/game/production";
import { ProductionBuildingInterface } from "@/interfaces/ProductionBuildingInterface";
import { StateManager } from "@/manager/stateManager";
import { ServerHandler } from "@/server/serverHandler";
import { Requirement } from "@/types/production.types";
import { ReturnMessage } from "@/types/setting.types";
import type { EntityType } from "@/types/state.types";
import { CategoryType, ProductionItem } from "@/types/storage.types";
import { Server, Socket } from "socket.io";

export class Building implements ProductionBuildingInterface {
  protected entity: EntityType;
  protected production: Production | null;
  protected range: number;

  public constructor(entity: EntityType) {
    this.entity = entity;
    this.production = null;
    this.range = 0;
  }

  public getEntity(): EntityType {
    return this.entity;
  }

  public setOwner(newOwner: string): void {
    this.entity.data.owner = newOwner;
  }

  public getCooldown(): number | null {
    if (this.production === null) return null;
    return this.production.getCooldownTime();
  }

  public getProductionTime(): number | null {
    if (this.production === null) return null;
    return this.production.getProductionTime();
  }

  public getRequirements(): Requirement | null {
    return null;
  }

  public hasRequirements(): boolean {
    return this.getRequirements() !== null;
  }

  public getCategory(): CategoryType | null {
    if (this.production === null) return null;
    return this.production.getCategory();
  }

  public produce(
    io: Server,
    socket: Socket,
    room: string
  ): ProductionItem | null | ReturnMessage {
    if (this.production === null) return null;
    return this.production.getProductionItem();
  }

  public isProductionBuilding(): boolean {
    return this.production !== null;
  }

  public getRange(): number {
    return this.range;
  }

  protected handleCellObstacleChange(
    room: string,
    findType: CellTypeEnum
  ): Cell | null {
    const cells: Cell[] = StateManager.getWorldInRange(
      room,
      this.entity.data.indices,
      this.range,
      findType
    );

    const closestCell: Cell | null = StateManager.getClosestCell(
      this.entity.data.indices,
      cells
    );

    return closestCell;
  }

  protected sendMessage(
    io: Server,
    socket: Socket,
    closestCell: Cell,
    sendType: CellTypeEnum
  ): void {
    ServerHandler.sendMessageToEveryOne(io, socket, "game:updateCell", {
      indices: closestCell.getIndices(),
      obstacle: sendType,
    });
  }
}
