import { Building } from "@/game/building";
import { ServerHandler } from "@/server/serverHandler";
import { StateManager } from "@/manager/stateManager";
import { Requirement } from "@/types/production.types";
import { EntityType } from "@/types/state.types";
import {
  CategoryType,
  ProductionItem,
  StorageType,
} from "@/types/storage.types";
import { Server, Socket } from "socket.io";
import { ReturnMessage } from "@/types/setting.types";

export const handleProduction = (io: Server, socket: Socket) => {
  const hasRequiredMaterials = (
    room: string,
    requirements: Requirement
  ): boolean => {
    if (!requirements) return false;

    const primaryItem = StateManager.getStorageItem(
      socket,
      room,
      requirements.primary.type,
      requirements.primary.name
    );

    if (primaryItem.amount <= 0) return false;

    let secondaryItem;

    if (requirements.secondary) {
      secondaryItem = StateManager.getStorageItem(
        socket,
        room,
        requirements.secondary.type,
        requirements.secondary.name
      );

      if (secondaryItem.amount <= 0) return false;
    }

    return true;
  };

  const produceItem = (room: string, building: Building): void => {
    const category: CategoryType | null = building.getCategory();
    const item: ProductionItem | null | ReturnMessage = building.produce(
      io,
      socket,
      room
    );

    if (!category || !item) return;

    if (typeof item === "object" && "message" in item) return;

    StateManager.updateStorageItem(socket, room, category, item, 1);
  };

  const updateMaterialsForProduction = (
    socket: Socket,
    room: string,
    requirements: Requirement
  ): void => {
    if (!requirements) return;
    StateManager.updateStorageItem(
      socket,
      room,
      requirements?.primary.type,
      requirements?.primary.name,
      -1
    );

    if (requirements.secondary) {
      StateManager.updateStorageItem(
        socket,
        room,
        requirements?.secondary.type,
        requirements?.secondary.name,
        -1
      );
    }
  };

  const handleProductionRequest = ({ entity }: { entity: EntityType }) => {
    const room: string = ServerHandler.getCurrentRoom(socket);
    const building: Building | undefined = StateManager.getBuildingByEntity(
      room,
      socket,
      entity
    );

    if (!building) return;

    if (!building.hasRequirements()) {
      produceItem(room, building);
    } else {
      const requirements: Requirement = building.getRequirements();
      if (hasRequiredMaterials(room, requirements)) {
        updateMaterialsForProduction(socket, room, requirements);
        produceItem(room, building);
      }
    }

    const storage: StorageType = StateManager.getStorage(socket, room);
    ServerHandler.sendMessageToSender(socket, "game:storageUpdate", {
      storage,
    });
  };
  socket.on("game:production", handleProductionRequest);
};
