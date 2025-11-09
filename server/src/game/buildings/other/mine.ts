import { ObstacleEnum } from "@/enums/ObstacleEnum";
import { Building } from "@/game/building";
import { Cell } from "@/game/cell";
import { Coal } from "@/game/produceable/coal";
import { IronOre } from "@/game/produceable/ironOre";
import { Production } from "@/game/production";
import { ReturnMessage } from "@/types/setting.types";
import { EntityType } from "@/types/state.types";
import { ProductionItem } from "@/types/storage.types";
import { Instance } from "@/types/world.types";
import { Server, Socket } from "socket.io";

export class Mine extends Building {
  private oreType: "iron_ore" | "coal";
  public constructor(building: EntityType, oreType: "iron_ore" | "coal") {
    super(building);
    this.oreType = oreType;

    this.production = new Production(10000, 7000, "materials", oreType);
    this.range = 2;
  }

  public produce(
    io: Server,
    socket: Socket,
    room: string
  ): ProductionItem | null | ReturnMessage {
    if (this.production === null) return null;

    const closestCell: Cell | null = this.handleCellObstacleChange(
      socket,
      this.oreType === "coal" ? ObstacleEnum.Coal : ObstacleEnum.Iron_ore,
      room
    );

    if (!closestCell) return null;
    const cellInstance: Instance = closestCell.getInstance();

    if (
      !cellInstance ||
      (cellInstance &&
        !(cellInstance instanceof Coal || cellInstance instanceof IronOre))
    ) {
      return null;
    }

    if (closestCell && cellInstance.getAmount() > 1) {
      cellInstance.decrease();
      return this.production.getProductionItem();
    }

    if (closestCell && cellInstance.getAmount() <= 1) {
      closestCell.removeObstacle(
        this.oreType === "coal" ? ObstacleEnum.Coal : ObstacleEnum.Iron_ore
      );
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
}
