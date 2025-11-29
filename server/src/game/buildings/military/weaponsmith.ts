import { Building } from "@/game/buildings/building";
import { Production } from "@/game/buildings/production";
import { Requirement } from "@/types/production.types";
import { ReturnMessage } from "@/types/setting.types";
import { EntityType } from "@/types/state.types";
import { ProductionItem } from "@/types/storage.types";
import { Server, Socket } from "socket.io";

export class WeaponSmith extends Building {
  private counter: number;
  private productionList: Record<number, string> = {
    0: "sword",
    1: "shield",
    2: "bow",
  };

  public constructor(building: EntityType) {
    super(building);

    this.counter = 0;
    this.production = new Production(
      6000,
      10000,
      "weapons",
      this.productionList[this.counter % 3] as ProductionItem
    );
  }

  public getRequirements(): Requirement | null {
    return {
      primary: { type: "ores", name: "coal" },
      secondary: { type: "metals", name: "iron" },
    };
  }

  public produce(
    io: Server,
    socket: Socket,
    room: string
  ): ProductionItem | null | ReturnMessage {
    if (this.production === null) return null;
    this.counter++;

    const currentItem: ProductionItem | null =
      this.production.getProductionItem();

    const nextItem: ProductionItem = this.productionList[
      this.counter % 3
    ] as ProductionItem;

    this.production.setProductionItem(nextItem);
    return currentItem;
  }
}
