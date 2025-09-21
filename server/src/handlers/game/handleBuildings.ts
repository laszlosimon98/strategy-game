import { Server, Socket } from "socket.io";
import { ServerHandler } from "@/classes/serverHandler";
import { Building } from "@/classes/game/building";
import { Indices } from "@/classes/utils/indices";
import { Validator } from "@/classes/validator";
import type { EntityType } from "@/types/state.types";
import { StateManager } from "@/manager/stateManager";

export const handleBuildings = (io: Server, socket: Socket) => {
  const build = (entity: EntityType): void => {
    if (!Validator.validateIndices(entity.data.indices)) {
      return;
    }

    const newBuilding: Building | undefined = StateManager.createBuilding(
      socket,
      entity
    );

    if (newBuilding) {
      ServerHandler.sendMessageToEveryOne(
        io,
        socket,
        "game:build",
        newBuilding.getEntity()
      );
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
