import { ObstacleEnum } from "@/enums/ObstacleEnum";
import { Cell } from "@/game/cell";
import { Entity } from "@/game/entities/entity";
import { Production } from "@/game/buildings/production";
import { ProductionBuildingInterface } from "@/interfaces/ProductionBuildingInterface";
import { StateManager } from "@/manager/stateManager";
import { CommunicationHandler } from "@/communication/communicationHandler";
import { Requirement } from "@/types/production.types";
import { ReturnMessage } from "@/types/setting.types";
import type { EntityType } from "@/types/state.types";
import { CategoryType, ProductionItem } from "@/types/storage.types";
import { Server, Socket } from "socket.io";

/**
 * Az épületek ősosztálya
 */
export class Building extends Entity implements ProductionBuildingInterface {
  protected production: Production | null;
  protected range: number;
  protected occupationRange: number;

  public constructor(entity: EntityType) {
    super(entity);
    this.production = null;
    this.range = 0;
    this.occupationRange = 0;
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

  /**
   * Egyedi termelési logika adható meg ebben a függvényben
   * @param io Socket.IO szerver
   * @param socket csatlakozott kliens
   * @param room szoba azonosító
   * @returns termelt tétel | null | válasz üzenet
   */
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

  public isCapturable(socket: Socket, room: string): boolean {
    return false;
  }

  public capturingBy(socket: Socket, room: string): string | undefined {
    return;
  }

  /**
   * Visszaadja a legközelebbi cellát, amin megtalálható a paraméterben megadott ObstacleEnum tag
   * @param socket csatlakozott kliens
   * @param findType a keresendő `obstacle` megnevezése
   * @param room szoba azonosító
   * @returns ha van akkor a legközelebbi cella, különben null
   */
  protected getClosestCell(
    socket: Socket,
    findType: ObstacleEnum,
    room: string
  ): Cell | null {
    const cells: Cell[] = StateManager.getWorldInRange(
      socket,
      this.entity.data.indices,
      this.range,
      findType,
      room
    );

    const closestCell: Cell | null = StateManager.getClosestCell(
      this.entity.data.indices,
      cells
    );

    return closestCell;
  }

  /**
   * Elküldi a frissített cellát és a hozzátartozó obstacle-t a klienseknek
   * @param io Socket.IO szerver
   * @param socket csatlakozott kliens
   * @param closestCell a megtalált legközelebbi cella
   * @param sendType a cellán található `obstacle` megnevezése
   */
  protected sendMessage(
    io: Server,
    socket: Socket,
    closestCell: Cell,
    sendType: ObstacleEnum
  ): void {
    CommunicationHandler.sendMessageToEveryOne(io, socket, "game:updateCell", {
      indices: closestCell.getIndices(),
      obstacle: sendType,
      owner: closestCell.getOwner(),
    });
  }
}
