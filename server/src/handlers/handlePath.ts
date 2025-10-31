import { Server, Socket } from "socket.io";
import { ServerHandler } from "@/server/serverHandler";
import { Cell } from "@/game/cell";
import { Unit } from "@/game/units/unit";
import { PathFinder } from "@/pathFind/pathFinder";
import { Indices } from "@/utils/indices";
import { Validator } from "@/utils/validator";
import type { EntityType } from "@/types/state.types";
import { StateManager } from "@/manager/stateManager";

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

    const room: string = ServerHandler.getCurrentRoom(socket);
    const world: Cell[][] = StateManager.getWorld(socket);
    const unit: Unit | undefined = StateManager.getUnit(room, entity);

    if (unit) {
      const indices: Indices[] = PathFinder.getPath(
        world,
        unit.getEntity().data.indices,
        goal
      );

      ServerHandler.sendMessageToEveryOne(io, socket, "game:pathFind", {
        path: indices,
        entity,
      });
    }
  };

  socket.on("game:pathFind", pathFind);
};
