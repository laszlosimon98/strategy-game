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
    this.production = new Production(7000, 8000, "materials", "stone");
    this.range = 3;
    this.miningAmount = 4;
  }

  public produce(
    io: Server,
    socket: Socket,
    room: string
  ): ProductionItem | null | ReturnMessage {
    if (this.production === null) return null;

    const closestCell: Cell | null = this.handleCellObstacleChange(
      room,
      CellTypeEnum.Stone
    );

    if (closestCell && this.miningAmount > 1) {
      this.miningAmount--;
      return this.production.getProductionItem();
    }

    if (closestCell && this.miningAmount <= 1) {
      this.miningAmount = 3;
      closestCell.setObstacleType(CellTypeEnum.Empty);
      this.sendMessage(io, socket, closestCell, CellTypeEnum.Empty);
      return this.production.getProductionItem();
    }

    return {
      message: "Nem található kő a közelben",
    };
  }
}
