import { Server, Socket } from "socket.io";
import { ServerHandler } from "@/server/serverHandler";
import { Building } from "@/game/building";
import { Indices } from "@/utils/indices";
import { Validator } from "@/utils/validator";
import type { EntityType } from "@/types/state.types";
import { StateManager } from "@/manager/stateManager";
import { ReturnMessage } from "@/types/setting.types";
import { StorageType } from "@/types/storage.types";
import { Buildings } from "@/types/building.types";
import { getImageNameFromUrl } from "@/utils/utils";
import { Territory } from "@/types/world.types";
import { World } from "@/game/world";

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
      const updatedCells: Territory[] | undefined = World.updateTerritory(
        socket,
        response
      );

      ServerHandler.sendMessageToEveryOne(
        io,
        socket,
        "game:build",
        response.getEntity()
      );

      if (updatedCells) {
        ServerHandler.sendMessageToEveryOne(
          io,
          socket,
          "game:updateTerritory",
          {
            data: updatedCells,
          }
        );
      }

      ServerHandler.sendMessageToSender(socket, "game:storageUpdate", {
        storage,
      });
    } else {
      ServerHandler.sendMessageToSender(socket, "game:info", response);
    }
  };

  const destroy = (entity: EntityType): void => {
    if (!Validator.validateIndices(entity.data.indices)) {
      return;
    }

    const {
      status,
      message,
    }: { status: "completed" | "failed" } & ReturnMessage =
      StateManager.destroyBuilding(socket, entity);

    if (status === "completed") {
      ServerHandler.sendMessageToEveryOne(io, socket, "game:destroy", {
        id: socket.id,
        entity,
      });
    }

    ServerHandler.sendMessageToSender(socket, "game:info", { message });
  };

  socket.on("game:build", build);
  socket.on("game:destroy", destroy);
};
