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

export class Woodcutter extends Building {
  public constructor(building: EntityType) {
    super(building);
    this.production = new Production(6000, 7500, "materials", "wood");
    this.range = 3;
  }

  public produce(
    io: Server,
    socket: Socket,
    room: string
  ): ProductionItem | null | ReturnMessage {
    if (this.production === null) return null;
    if (this.handleCellObstacleChange(io, socket, room)) {
      return this.production.getProductionItem();
    } else {
      return {
        message: "Nem található fa a közelben",
      };
    }
  }

  private handleCellObstacleChange(
    io: Server,
    socket: Socket,
    room: string
  ): boolean {
    const cells: Cell[] = StateManager.getWorldInRange(
      room,
      this.entity.data.indices,
      this.range,
      CellTypeEnum.Tree
    );

    const closestCell: Cell | null = StateManager.getClosestCell(
      this.entity.data.indices,
      cells
    );

    if (closestCell === null) {
      return false;
    }

    closestCell.setObstacleType(CellTypeEnum.Empty);
    this.sendMessage(io, socket, closestCell);
    return true;
  }

  protected sendMessage(io: Server, socket: Socket, closestCell: Cell): void {
    ServerHandler.sendMessageToEveryOne(io, socket, "game:updateCell", {
      indices: closestCell.getIndices(),
      obstacle: null,
    });
  }
}
