import { ObstacleEnum } from "@/enums/ObstacleEnum";
import { Building } from "@/game/buildings/building";
import { Cell } from "@/game/cell";
import { IronOre } from "@/game/produceable/ironOre";
import { Production } from "@/game/buildings/production";
import { Requirement } from "@/types/production.types";
import { ReturnMessage } from "@/types/setting.types";
import { EntityType } from "@/types/state.types";
import { ProductionItem } from "@/types/storage.types";
import { Instance } from "@/types/world.types";
import { Server, Socket } from "socket.io";

export class IronMine extends Building {
  public constructor(building: EntityType) {
    super(building);

    this.production = new Production(10000, 7000, "ores", "iron_ore");
    this.range = 2;
  }

  public produce(
    io: Server,
    socket: Socket,
    room: string
  ): ProductionItem | null | ReturnMessage {
    if (this.production === null) return null;

    const closestCell: Cell | null = this.getClosestCell(
      socket,
      ObstacleEnum.IronOre,
      room
    );

    if (!closestCell) return null;
    const cellInstance: Instance = closestCell.getInstance();

    if (!cellInstance || (cellInstance && !(cellInstance instanceof IronOre))) {
      return null;
    }

    if (closestCell && cellInstance.getAmount() > 1) {
      cellInstance.decrease();
      return this.production.getProductionItem();
    }

    if (closestCell && cellInstance.getAmount() <= 1) {
      closestCell.removeObstacle(ObstacleEnum.IronOre);
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
      message: "Nem található nyersanyag a közelben",
    };
  }

  public getRequirements(): Requirement | null {
    return {
      primary: { type: "foods", name: "bread" },
    };
  }
}
