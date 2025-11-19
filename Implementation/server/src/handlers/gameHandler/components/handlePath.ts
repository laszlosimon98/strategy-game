import { Server, Socket } from "socket.io";
import { Communicate } from "../../../classes/communicate";
import { Cell } from "../../../classes/game/cell";
import { Unit } from "../../../classes/game/unit";
import { PathFinder } from "../../../classes/pathFind/pathFinder";
import { Indices } from "../../../classes/utils/indices";
import { getUnit } from "../../../classes/utils/utils";
import { Validator } from "../../../classes/validator";
import { state } from "../../../data/state";
import { EntityType } from "../../../types/types";

export const handlePath = (io: Server, socket: Socket) => {
  const pathFind = ({
    entity,
    goal,
  }: {
    entity: EntityType;
    goal: Indices;
  }) => {
    if (!Validator.validateIndices(goal)) {
      return;
    }

    const world: Cell[][] = state[Communicate.getCurrentRoom(socket)].world;
    const unit: Unit | undefined = getUnit(socket, entity);

    if (unit) {
      const indices: Indices[] = PathFinder.getPath(
        world,
        unit.getEntity().data.indices,
        goal
      );

      Communicate.sendMessageToEveryOne(io, socket, "game:pathFind", {
        path: indices,
        entity,
      });
    }
  };

  socket.on("game:pathFind", pathFind);
};
