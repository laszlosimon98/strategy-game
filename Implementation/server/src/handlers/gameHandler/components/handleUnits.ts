import { Server, Socket } from "socket.io";
import { Communicate } from "../../../classes/communicate";
import { Unit } from "../../../classes/game/unit";
import { Indices } from "../../../classes/utils/indices";
import { calculateDistance, getUnit } from "../../../classes/utils/utils";
import { Validator } from "../../../classes/validator";
import { state } from "../../../data/state";
import { EntityType } from "../../../types/types";
import { Cell } from "../../../classes/game/cell";
import { World } from "../../../classes/game/world";
import { PathFinder } from "../../../classes/pathFind/pathFinder";
import { units } from "../../../data/units";

export const handleUnits = (io: Server, socket: Socket) => {
  const unitCreate = ({
    entity,
    name,
  }: {
    entity: EntityType;
    name: string;
  }): void => {
    if (!Validator.validateIndices(entity.data.indices)) {
      return;
    }

    entity.data.owner = socket.id;
    const unit = new Unit(entity, name);

    state[Communicate.getCurrentRoom(socket)].players[socket.id].units.push(
      unit
    );

    Communicate.sendMessageToEveryOne(io, socket, "game:unitCreate", {
      entity: unit.getEntity(),
      properties: units[name],
    });
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

  const unitUpdatePosition = (entity: EntityType): void => {
    const unit: Unit | undefined = getUnit(socket, entity);
    if (unit) {
      unit.setPosition(entity.data.position);
    }

    Communicate.sendMessageToEveryOneExceptSender(
      socket,
      "game:unitMoveUpdatePosition",
      entity
    );
  };

  const startAttack = (unit: EntityType): void => {
    const a = {
      id: unit.data.id,
      owner: unit.data.owner,
    };

    Communicate.sendMessageToEveryOne(io, socket, "game:unitStartAttacking", a);
  };

  const stopAttack = (unit: EntityType): void => {
    const a = {
      id: unit.data.id,
      owner: unit.data.owner,
    };

    Communicate.sendMessageToEveryOne(io, socket, "game:unitStopAttacking", a);
  };

  const dealDamage = ({
    unit,
    opponent,
  }: {
    unit: EntityType;
    opponent: EntityType;
  }): void => {
    const _unit: Unit | undefined = getUnit(socket, unit);
    const _opponent: Unit | undefined = getUnit(socket, opponent);

    if (_unit && _opponent) {
      _opponent.takeDamage(_unit.getDamage());

      if (_opponent.getHealth() > 0) {
        Communicate.sendMessageToEveryOne(io, socket, "game:unitDealDamage", {
          entity: _opponent.getEntity(),
          health: _opponent.getHealth(),
        });
      } else {
        Communicate.sendMessageToEveryOne(io, socket, "game:unitDies", {
          unit: _unit.getEntity(),
          opponent: _opponent.getEntity(),
        });
      }
    }
  };

  socket.on("game:unitCreate", unitCreate);
  socket.on("game:unitMoving", unitMoving);
  socket.on("game:unitMovePositionUpdate", unitUpdatePosition);
  socket.on("game:unitStartAttacking", startAttack);
  socket.on("game:unitStopAttacking", stopAttack);

  socket.on("game:unitDealDamage", dealDamage);
};
