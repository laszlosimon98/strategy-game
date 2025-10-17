import { CellTypeEnum } from "@/enums/cellTypeEnum";
import { Building } from "@/game/building";
import { Cell } from "@/game/cell";
import { Tree } from "@/game/produceable/tree";
import { Production } from "@/game/production";
import { ReturnMessage } from "@/types/setting.types";
import { EntityType } from "@/types/state.types";
import { ProductionItem } from "@/types/storage.types";
import { Server, Socket } from "socket.io";

export class Forester extends Building {
  public constructor(building: EntityType) {
    super(building);
    this.production = new Production(100, 120, "", "");
    this.range = 4;
  }

  public produce(
    io: Server,
    socket: Socket,
    room: string
  ): ProductionItem | null | ReturnMessage {
    const closestCell: Cell | null = this.handleCellObstacleChange(
      room,
      CellTypeEnum.Empty
    );

    if (closestCell) {
      closestCell.setObstacleType(CellTypeEnum.Tree);
      closestCell.setObstacle(true);
      closestCell.setInstance(new Tree());
      this.sendMessage(io, socket, closestCell, CellTypeEnum.Tree);
    }

    return null;
  }
}
