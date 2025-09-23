import { Server, Socket } from "socket.io";
import { ServerHandler } from "@/classes/serverHandler";
import { Building } from "@/classes/game/building";
import { Indices } from "@/classes/utils/indices";
import { Validator } from "@/classes/validator";
import type { EntityType } from "@/types/state.types";
import { StateManager } from "@/manager/stateManager";
import { ErrorMessage } from "@/types/setting.types";

export const handleBuildings = (io: Server, socket: Socket) => {
  const build = (entity: EntityType): void => {
    if (!Validator.validateIndices(entity.data.indices)) {
      return;
    }

    const response: Building | ErrorMessage = StateManager.createBuilding(
      socket,
      entity
    );

    if (response instanceof Building) {
      ServerHandler.sendMessageToEveryOne(
        io,
        socket,
        "game:build",
        response.getEntity()
      );
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
