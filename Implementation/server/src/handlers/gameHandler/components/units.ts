import { Server, Socket } from "socket.io";
import { Communicate } from "../../../classes/communicate";
import { Unit } from "../../../classes/game/unit";
import { Indices } from "../../../classes/utils/indices";
import { getUnit } from "../../../classes/utils/utils";
import { Validator } from "../../../classes/validator";
import { state } from "../../../data/state";
import { EntityType } from "../../../types/types";
import { Cell } from "../../../classes/game/cell";
import { World } from "../../../classes/game/world";
import { PathFinder } from "../../../classes/pathFind/pathFinder";

export const handleUnits = (io: Server, socket: Socket) => {
  const unitCreate = (entity: EntityType): void => {
    if (!Validator.validateIndices(entity.data.indices)) {
      return;
    }

    entity.data.owner = socket.id;
    const unit = new Unit(entity);

    state[Communicate.getCurrentRoom(socket)].players[socket.id].units.push(
      unit
    );

    Communicate.sendMessageToEveryOne(
      io,
      socket,
      "game:unitCreate",
      unit.getEntity()
    );
  };

  const unitMoving = ({
    entity,
    next,
    goal,
  }: {
    entity: EntityType;
    next: Indices;
    goal: Indices;
  }) => {
    const unit: Unit | undefined = getUnit(socket, entity);
    if (unit) {
      const world: Cell[][] = World.getWorld(socket);

      if (!world[next.i][next.j].isWalkAble()) {
        const indices: Indices[] = PathFinder.getPath(
          world,
          unit.getEntity().data.indices,
          goal
        );

        Communicate.sendMessageToEveryOne(io, socket, "game:pathFind", {
          path: indices,
          entity,
        });
      } else {
        unit.setIndices(next);
        Communicate.sendMessageToEveryOne(io, socket, "game:unitMoving", next);
      }
    }
  };

  socket.on("game:unitCreate", unitCreate);
  socket.on("game:unitMoving", unitMoving);
};
