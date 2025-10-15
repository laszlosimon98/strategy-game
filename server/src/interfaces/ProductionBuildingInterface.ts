import { Requirement } from "@/types/production.types";
import { ReturnMessage } from "@/types/setting.types";
import { ProductionItem } from "@/types/storage.types";
import { Server, Socket } from "socket.io";

export interface ProductionBuildingInterface {
  getCooldown: () => number | null;
  getProductionTime: () => number | null;
  getRequirements: () => Requirement | null;
  produce: (
    io: Server,
    socket: Socket,
    room: string
  ) => ProductionItem | null | ReturnMessage;
  hasRequirements: () => boolean;
}
