import { ObstacleEnum } from "@/enums/ObstacleEnum";
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
    socket: Socket
  ): ProductionItem | null | ReturnMessage {
    if (this.production === null) return null;

    const closestCell: Cell | null = this.handleCellObstacleChange(
      socket,
      ObstacleEnum.Tree
    );

    if (!closestCell) return null;
    const cellInstance: Instance = closestCell.getInstance();
    if (!cellInstance || (cellInstance && !(cellInstance instanceof Tree)))
      return null;

    if (closestCell) {
      closestCell.removeObstacle(ObstacleEnum.Tree);
      closestCell.setInstance(null);
      this.sendMessage(
        io,
        socket,
        closestCell,
        closestCell.getHighestPriorityObstacleType()
      );
      return this.production.getProductionItem();
    }

    return {
      message: "Nem található fa a közelben",
    };
  }
}
