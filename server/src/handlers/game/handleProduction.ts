import { Building } from "@/classes/game/building";
import { ServerHandler } from "@/classes/serverHandler";
import { StateManager } from "@/manager/stateManager";
import { EntityType } from "@/types/state.types";
import {
  CategoryType,
  ProductionItem,
  StorageType,
} from "@/types/storage.types";
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
  const handleProductionRequest = ({ entity }: { entity: EntityType }) => {
    const room: string = ServerHandler.getCurrentRoom(socket);
    const building: Building | undefined = StateManager.getBuildingByEntity(
      room,
      socket,
      entity
    );

    if (!building) return;

    if (building.hasRequirements() !== null) {
      const category: CategoryType | null = building.getCategory();
      const item: ProductionItem | null = building.getProductionItem();

      if (!category || !item) return;

      StateManager.updateStorageItem(socket, room, category, item, 1);
    }

    const storage: StorageType = StateManager.getStorage(socket, room);
    ServerHandler.sendMessageToSender(socket, "game:storageUpdate", {
      storage,
    });

    // if (!hasRequirements(entity)) {
    //   StateManager.updateStorageItem(socket, room, "foods", "grain", 1);
    //   const storage: StorageType = StateManager.getStorage(socket, room);
    //   ServerHandler.sendMessageToSender(socket, "game:storageUpdate", {
    //     storage,
    //   });
    // } else {
    //   const requirements = StateManager.getBuildingRequirements(
    //     entity.data.name as Buildings
    //   ) as Requirement;
    //   if (checkRequirements(requirements, room)) {
    //     // update storage
    //   }
    // }
  };
  socket.on("game:production", handleProductionRequest);
};
