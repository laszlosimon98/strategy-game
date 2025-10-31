import { Server, Socket } from "socket.io";
import { ServerHandler } from "@/server/serverHandler";
import { Unit } from "@/game/units/unit";
import { Validator } from "@/utils/validator";
import type { EntityType } from "@/types/state.types";
import { StateManager } from "@/manager/stateManager";
import { ReturnMessage } from "@/types/setting.types";
import { StorageType } from "@/types/storage.types";
import { Soldier } from "@/game/units/soldier";

export const handleUnits = (io: Server, socket: Socket) => {
  const calculateNewStorageValues = (room: string, name: string): void => {
    if (name === "knight") {
      StateManager.updateStorageItem(socket, room, "weapons", "sword", -1);
      StateManager.updateStorageItem(socket, room, "weapons", "shield", -1);
    } else {
      StateManager.updateStorageItem(socket, room, "weapons", "bow", -1);
    }
  };

  const unitCreate = ({ entity }: { entity: EntityType }): void => {
    if (!Validator.validateIndices(entity.data.indices)) {
      return;
    }

    entity.data.owner = socket.id;
    const room = ServerHandler.getCurrentRoom(socket);

    const response: Soldier | ReturnMessage = StateManager.createSoldier(
      socket,
      entity
    );

    if (!["knight", "archer"].includes(entity.data.name)) {
      ServerHandler.sendMessageToSender(socket, "game:info", {
        message: "Az egység nem lovag vagy íjász!",
      });

      return;
    }

    console.log(response);

    if (response instanceof Soldier) {
      calculateNewStorageValues(room, entity.data.name);
      const storage: StorageType = StateManager.getStorage(socket, room);

      ServerHandler.sendMessageToEveryOne(io, socket, "game:soldier-create", {
        entity: response.getEntity(),
        properties: response.getProperties(),
      });

      ServerHandler.sendMessageToSender(socket, "game:storageUpdate", {
        storage,
      });
    } else {
      ServerHandler.sendMessageToSender(socket, "game:info", response);
    }
  };

  const deleteUnit = (unit: Unit): void => {
    const room: string = ServerHandler.getCurrentRoom(socket);
    StateManager.deleteUnit(room, unit);
  };

  socket.on("game:soldier-create", unitCreate);
};
