import { ObstacleEnum } from "@/enums/ObstacleEnum";
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
    this.production = new Production(10000, 12000, "", "");
    this.range = 5;
  }

  public produce(
    io: Server,
    socket: Socket
  ): ProductionItem | null | ReturnMessage {
    const closestCell: Cell | null = this.handleCellObstacleChange(
      socket,
      ObstacleEnum.Empty
    );

    if (closestCell) {
      closestCell.addObstacle(ObstacleEnum.Tree);
      closestCell.setInstance(new Tree());
      this.sendMessage(
        io,
        socket,
        closestCell,
        closestCell.getHighestPriorityObstacleType()
      );
    }

    return null;
  }
}
