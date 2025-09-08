import { Server, Socket } from "socket.io";
import { Communicate } from "@/classes/communicate";
import { Builder } from "@/classes/game/builder";
import { Building } from "@/classes/game/building";
import { Indices } from "@/classes/utils/indices";
import { Validator } from "@/classes/validator";
import type { EntityType } from "@/types/state.types";

export const handleBuildings = (io: Server, socket: Socket) => {
  const build = (entity: EntityType): void => {
    if (!Validator.validateIndices(entity.data.indices)) {
      return;
    }

    const newBuilding: Building | undefined = Builder.build(entity, socket);

    if (newBuilding) {
      Communicate.sendMessageToEveryOne(
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

    const isSuccessful: boolean = Builder.destroy(indices, socket);
    if (isSuccessful) {
      Communicate.sendMessageToEveryOne(io, socket, "game:destroy", {
        id: socket.id,
        indices,
      });
    }
  };

  socket.on("game:build", build);
  socket.on("game:destroy", destroy);
};
