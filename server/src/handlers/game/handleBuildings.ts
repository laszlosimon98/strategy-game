import { Server, Socket } from "socket.io";
import { ServerHandler } from "@/classes/serverHandler";
import { Building } from "@/classes/game/building";
import { Indices } from "@/classes/utils/indices";
import { Validator } from "@/classes/validator";
import type { EntityType } from "@/types/state.types";
import { StateManager } from "@/manager/stateManager";
import { ErrorMessage } from "@/types/setting.types";
import { StorageType } from "@/types/storage.types";
import { Buildings } from "@/types/building.types";
import { getImageNameFromUrl } from "@/classes/utils/utils";

export const handleBuildings = (io: Server, socket: Socket) => {
  const calculateNewStorageValues = (
    room: string,
    building: Building
  ): StorageType => {
    const currentStorageState: StorageType = StateManager.getStorage(
      socket,
      room
    );

    const buildingName: string = getImageNameFromUrl(
      building.getEntity().data.url
    );

    const { boards, stone } =
      StateManager.getBuidingPrices()[buildingName as Buildings];

    const { boards: storageBoards, stone: storageStone } =
      currentStorageState.materials;

    const newBoardsValue: number = storageBoards.amount - boards;
    const newStoneValue: number = storageStone.amount - stone;

    return {
      ...currentStorageState,
      materials: {
        ...currentStorageState.materials,
        boards: {
          ...currentStorageState.materials.boards,
          amount: newBoardsValue,
        },
        stone: {
          ...currentStorageState.materials.stone,
          amount: newStoneValue,
        },
      },
    };
  };

  const build = (entity: EntityType): void => {
    if (!Validator.validateIndices(entity.data.indices)) {
      return;
    }
    console.log(entity);
    const room: string = ServerHandler.getCurrentRoom(socket);
    const response: Building | ErrorMessage = StateManager.createBuilding(
      socket,
      entity
    );

    if (response instanceof Building) {
      const newStorageValues: StorageType = calculateNewStorageValues(
        room,
        response
      );

      StateManager.updateStorage(socket, room, newStorageValues);

      ServerHandler.sendMessageToEveryOne(
        io,
        socket,
        "game:build",
        response.getEntity()
      );

      ServerHandler.sendMessageToSender(socket, "game:storageUpdate", {
        storage: newStorageValues,
      });
    } else {
      ServerHandler.sendMessageToSender(socket, "game:error", response);
    }
  };

  const destroy = (indices: Indices): void => {
    if (!Validator.validateIndices(indices)) {
      return;
    }

    const isSuccessful: boolean = StateManager.destroyBuilding(socket, indices);
    if (isSuccessful) {
      ServerHandler.sendMessageToEveryOne(io, socket, "game:destroy", {
        id: socket.id,
        indices,
      });
    }
  };

  socket.on("game:build", build);
  socket.on("game:destroy", destroy);
};
