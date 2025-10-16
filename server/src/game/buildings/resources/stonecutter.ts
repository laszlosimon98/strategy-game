import { CellTypeEnum } from "@/enums/cellTypeEnum";
import { Building } from "@/game/building";
import { Cell } from "@/game/cell";
import { Production } from "@/game/production";
import { StateManager } from "@/manager/stateManager";
import { ServerHandler } from "@/server/serverHandler";
import { ReturnMessage } from "@/types/setting.types";
import { EntityType } from "@/types/state.types";
import { ProductionItem } from "@/types/storage.types";
import { Server, Socket } from "socket.io";

export class Stonecutter extends Building {
  private miningAmount: number;
  public constructor(building: EntityType) {
    super(building);
    this.production = new Production(1000, 1000, "materials", "stone");
    this.range = 3;
    this.miningAmount = 3;
  }

  public produce(
    io: Server,
    socket: Socket,
    room: string
  ): ProductionItem | null | ReturnMessage {
    if (this.production === null) return null;

    const closestCell: Cell | null = this.handleCellObstacleChange(room);

    if (closestCell && this.miningAmount > 1) {
      this.miningAmount--;
      return this.production.getProductionItem();
    }

    if (closestCell && this.miningAmount <= 1) {
      this.miningAmount = 3;
      this.sendMessage(io, socket, closestCell);
      closestCell.setObstacleType(CellTypeEnum.Empty);
      return this.production.getProductionItem();
    }

    return {
      message: "Nem található kő a közelben",
    };

    // if (this.miningAmount > 0) {
    //   this.miningAmount--;
    //   return this.production.getProductionItem();
    // } else {
    //   this.miningAmount = 3;
    //   if (this.handleCellObstacleChange(io, socket, room)) {
    //     return this.production.getProductionItem();
    //   } else {
    //     console.log("Elfogyott a kő");
    //     return {
    //       message: "Nem található kő a közelben",
    //     };
    //   }
    // }
  }

  private handleCellObstacleChange(room: string): Cell | null {
    const cells: Cell[] = StateManager.getWorldInRange(
      room,
      this.entity.data.indices,
      this.range,
      CellTypeEnum.Stone
    );

    const closestCell: Cell | null = StateManager.getClosestCell(
      this.entity.data.indices,
      cells
    );

    // if (closestCell === null) {
    //   return false;
    // }

    // closestCell.setObstacleType(CellTypeEnum.Empty);
    // this.sendMessage(io, socket, closestCell);
    // return true;

    return closestCell;
  }

  protected sendMessage(io: Server, socket: Socket, closestCell: Cell): void {
    ServerHandler.sendMessageToEveryOne(io, socket, "game:updateCell", {
      indices: closestCell.getIndices(),
      obstacle: CellTypeEnum.Empty,
    });
  }
}
