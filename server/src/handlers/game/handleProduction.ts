import { ServerHandler } from "@/classes/serverHandler";
import { StateManager } from "@/manager/stateManager";
import { EntityType } from "@/types/state.types";
import { StorageType } from "@/types/storage.types";
import { Server, Socket } from "socket.io";

export const handleProduction = (io: Server, socket: Socket) => {
  const checkRequirements = (entity: EntityType): boolean => {
    return true;
  };

  const handleProductionRequest = ({ entity }: { entity: EntityType }) => {
    const room: string = ServerHandler.getCurrentRoom(socket);

    if (checkRequirements(entity)) {
      console.log(entity);
      StateManager.updateStorageItem(socket, room, "foods", "grain", 1);

      const storage: StorageType = StateManager.getStorage(socket, room);

      ServerHandler.sendMessageToSender(socket, "game:storageUpdate", {
        storage,
      });
    }
  };

  socket.on("game:production", handleProductionRequest);
};
