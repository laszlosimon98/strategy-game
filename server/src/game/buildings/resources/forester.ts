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

export class Forester extends Building {
  public constructor(building: EntityType) {
    super(building);
    this.production = new Production(10000, 12000, "", "");
    this.range = 4;
  }

  public produce(
    io: Server,
    socket: Socket,
    room: string
  ): ProductionItem | null | ReturnMessage {
    this.handleCellObstacleChange(io, socket, room);
    return null;
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
      CellTypeEnum.Empty
    );

    const closestCell: Cell | null = StateManager.getClosestCell(
      this.entity.data.indices,
      cells
    );

    if (closestCell === null) {
      return false;
    }

    closestCell.setObstacleType(CellTypeEnum.Tree);
    this.sendMessage(io, socket, closestCell);
    return true;
  }

  protected sendMessage(io: Server, socket: Socket, closestCell: Cell): void {
    ServerHandler.sendMessageToEveryOne(io, socket, "game:updateCell", {
      indices: closestCell.getIndices(),
      obstacle: CellTypeEnum.Tree,
    });
  }
}
