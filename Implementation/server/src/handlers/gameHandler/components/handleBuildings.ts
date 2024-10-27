import { Server, Socket } from "socket.io";
import { Communicate } from "../../../classes/communicate";
import { Builder } from "../../../classes/game/builder";
import { Building } from "../../../classes/game/building";
import { Cell } from "../../../classes/game/cell";
import { Indices } from "../../../classes/utils/indices";
import { Validator } from "../../../classes/validator";
import { EntityType } from "../../../types/types";

export const handleBuildings = (io: Server, socket: Socket) => {
  const build = (entity: EntityType): void => {
    if (!Validator.validateIndices(entity.data.indices)) {
      return;
    }

    const {
      newBuilding,
      changedCells,
    }: {
      newBuilding: Building | undefined;
      changedCells: Cell[];
    } = Builder.build(entity, socket);

    if (newBuilding) {
      const cells = changedCells.map((cell) => {
        return {
          indices: cell.getIndices(),
          type: cell.getType(),
        };
      });

      Communicate.sendMessageToEveryOne(io, socket, "game:build", {
        newBuilding: newBuilding.getEntity(),
        changedCells: cells,
      });
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
