import { Server, Socket } from "socket.io";
import { ServerHandler } from "@/classes/serverHandler";
import { Building } from "@/classes/game/building";
import { Indices } from "@/classes/utils/indices";
import { Validator } from "@/classes/validator";
import type { EntityType } from "@/types/state.types";
import { StateManager } from "@/manager/stateManager";
import { ReturnMessage } from "@/types/setting.types";
import { StorageType } from "@/types/storage.types";
import { Buildings } from "@/types/building.types";
import { getImageNameFromUrl } from "@/classes/utils/utils";

export const handleBuildings = (io: Server, socket: Socket) => {
  const calculateNewStorageValues = (
    room: string,
    building: Building
  ): void => {
    const buildingName: string = getImageNameFromUrl(
      building.getEntity().data.url
    );

    const { boards: boardsAmount, stone: stoneAmount } =
      StateManager.getBuidingPrices()[buildingName as Buildings];

    StateManager.updateStorageItem(
      socket,
      room,
      "materials",
      "boards",
      -boardsAmount
    );

    StateManager.updateStorageItem(
      socket,
      room,
      "materials",
      "stone",
      -stoneAmount
    );
  };

  const build = (entity: EntityType): void => {
    if (!Validator.validateIndices(entity.data.indices)) {
      return;
    }
    const room: string = ServerHandler.getCurrentRoom(socket);
    const response: Building | ReturnMessage = StateManager.createBuilding(
      socket,
      entity
    );

    if (response instanceof Building) {
      calculateNewStorageValues(room, response);

      const storage: StorageType = StateManager.getStorage(socket, room);

      ServerHandler.sendMessageToEveryOne(
        io,
        socket,
        "game:build",
        response.getEntity()
      );

      ServerHandler.sendMessageToSender(socket, "game:storageUpdate", {
        storage,
      });
    } else {
      ServerHandler.sendMessageToSender(socket, "game:info", response);
    }
  };

  const destroy = (indices: Indices): void => {
    if (!Validator.validateIndices(indices)) {
      return;
    }

    const {
      status,
      message,
    }: { status: "completed" | "failed" } & ReturnMessage =
      StateManager.destroyBuilding(socket, indices);

    if (status === "completed") {
      ServerHandler.sendMessageToEveryOne(io, socket, "game:destroy", {
        id: socket.id,
        indices,
      });
    }

    ServerHandler.sendMessageToSender(socket, "game:info", { message });
  };

  socket.on("game:build", build);
  socket.on("game:destroy", destroy);
};
