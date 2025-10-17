import { CellTypeEnum } from "@/enums/cellTypeEnum";
import { Building } from "@/game/building";
import { Cell } from "@/game/cell";
import { Tree } from "@/game/produceable/tree";
import { Production } from "@/game/production";
import { ReturnMessage } from "@/types/setting.types";
import { EntityType } from "@/types/state.types";
import { ProductionItem } from "@/types/storage.types";
import { Instance } from "@/types/world.types";
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

    const closestCell: Cell | null = this.handleCellObstacleChange(
      room,
      CellTypeEnum.Tree
    );

    if (!closestCell) return null;
    const cellInstance: Instance = closestCell.getInstance();
    if (!cellInstance || (cellInstance && !(cellInstance instanceof Tree)))
      return null;

    if (closestCell) {
      closestCell.setObstacleType(CellTypeEnum.Empty);
      closestCell.setObstacle(false);
      closestCell.setInstance(null);
      this.sendMessage(io, socket, closestCell, CellTypeEnum.Empty);
      return this.production.getProductionItem();
    }

    return {
      message: "Nem található fa a közelben",
    };
  }
}
