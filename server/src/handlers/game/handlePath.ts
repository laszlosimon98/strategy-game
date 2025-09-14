import { Server, Socket } from "socket.io";
import { ServerHandler } from "@/classes/serverHandler";
import { Cell } from "@/classes/game/cell";
import { Unit } from "@/classes/game/unit";
import { PathFinder } from "@/classes/pathFind/pathFinder";
import { Indices } from "@/classes/utils/indices";
import { Validator } from "@/classes/validator";
import type { EntityType } from "@/types/state.types";
import { GameStateManager } from "@/manager/gameStateManager";

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
    const world: Cell[][] = GameStateManager.getWorld(room);
    const unit: Unit | undefined = GameStateManager.getUnit(room, entity);

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
