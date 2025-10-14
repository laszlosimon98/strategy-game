import { ServerHandler } from "@/classes/serverHandler";
import { StateManager } from "@/manager/stateManager";
import { Buildings } from "@/types/building.types";
import { Requirement } from "@/types/production.types";
import { EntityType } from "@/types/state.types";
import { StorageType } from "@/types/storage.types";
import { Server, Socket } from "socket.io";

export const handleProduction = (io: Server, socket: Socket) => {
  // const hasRequirements = (entity: EntityType): boolean => {
  //   return (
  //     StateManager.getBuildingRequirements(entity.data.name as Buildings) !==
  //     null
  //   );
  // };
  // const checkRequirements = (
  //   requirements: Requirement,
  //   room: string
  // ): boolean => {
  //   if (!requirements) return false;
  //   const primaryItem = StateManager.getStorageItem(
  //     socket,
  //     room,
  //     requirements.primary.type,
  //     requirements.primary.name
  //   );
  //   let secondaryItem;
  //   if (requirements.secondary) {
  //     secondaryItem = StateManager.getStorageItem(
  //       socket,
  //       room,
  //       requirements.secondary.type,
  //       requirements.secondary.name
  //     );
  //   }
  //   return primaryItem.amount > 0 && secondaryItem
  //     ? secondaryItem.amount > 0
  //     : true;
  // };
  // const handleProductionRequest = ({ entity }: { entity: EntityType }) => {
  //   const room: string = ServerHandler.getCurrentRoom(socket);
  //   if (!hasRequirements(entity)) {
  //     StateManager.updateStorageItem(socket, room, "foods", "grain", 1);
  //     const storage: StorageType = StateManager.getStorage(socket, room);
  //     ServerHandler.sendMessageToSender(socket, "game:storageUpdate", {
  //       storage,
  //     });
  //   } else {
  //     const requirements = StateManager.getBuildingRequirements(
  //       entity.data.name as Buildings
  //     ) as Requirement;
  //     if (checkRequirements(requirements, room)) {
  //       // update storage
  //     }
  //   }
  // };
  // socket.on("game:production", handleProductionRequest);
};
