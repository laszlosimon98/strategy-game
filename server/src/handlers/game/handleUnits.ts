import { Server, Socket } from "socket.io";
import { ServerHandler } from "@/classes/serverHandler";
import { Unit } from "@/classes/game/unit";
import { Indices } from "@/classes/utils/indices";
import { Validator } from "@/classes/validator";
import type { EntityType } from "@/types/state.types";
import { Cell } from "@/classes/game/cell";
import { World } from "@/classes/game/world";
import { PathFinder } from "@/classes/pathFind/pathFinder";
import type { Position } from "@/types/utils.types";
import { StateManager } from "@/manager/stateManager";
import { ReturnMessage } from "@/types/setting.types";
import { StorageType } from "@/types/storage.types";

export const handleUnits = (io: Server, socket: Socket) => {
  const calculateNewStorageValues = (
    room: string,
    name: "knight" | "archer"
  ): void => {
    if (name === "knight") {
      StateManager.updateStorageItem(socket, room, "weapons", "sword", 1);
      StateManager.updateStorageItem(socket, room, "weapons", "shield", 1);
    } else {
      StateManager.updateStorageItem(socket, room, "weapons", "bow", 1);
    }
  };

  const unitCreate = ({
    entity,
    name,
  }: {
    entity: EntityType;
    name: "knight" | "archer";
  }): void => {
    if (!Validator.validateIndices(entity.data.indices)) {
      return;
    }

    entity.data.owner = socket.id;
    const room = ServerHandler.getCurrentRoom(socket);

    const response: Unit | ReturnMessage = StateManager.createUnit(
      socket,
      room,
      entity,
      name
    );

    if (response instanceof Unit) {
      calculateNewStorageValues(room, name);
      const storage: StorageType = StateManager.getStorage(socket, room);

      ServerHandler.sendMessageToEveryOne(io, socket, "game:unitCreate", {
        entity: response.getEntity(),
        properties: StateManager.getUnitProperties()[name],
      });

      ServerHandler.sendMessageToSender(socket, "game:storageUpdate", {
        storage,
      });
    } else {
      ServerHandler.sendMessageToSender(socket, "game:info", response);
    }
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
    const room: string = ServerHandler.getCurrentRoom(socket);
    const unit: Unit | undefined = StateManager.getUnit(room, entity);

    if (unit) {
      const world: Cell[][] = World.getWorld(socket);

      if (!world[next.i][next.j].isWalkAble()) {
        const indices: Indices[] = PathFinder.getPath(
          world,
          unit.getEntity().data.indices,
          goal
        );

        ServerHandler.sendMessageToEveryOne(io, socket, "game:pathFind", {
          path: indices,
          entity,
        });
      } else {
        unit.setIndices(next);
        ServerHandler.sendMessageToEveryOne(
          io,
          socket,
          "game:unitMoving",
          next
        );
      }
    }
  };

  const unitUpdatePosition = ({
    entity,
    newPos,
    direction,
  }: {
    entity: EntityType;
    newPos: Position;
    direction: string;
  }): void => {
    const room: string = ServerHandler.getCurrentRoom(socket);
    const unit: Unit | undefined = StateManager.getUnit(room, entity);

    if (unit) {
      unit.setPosition(newPos);
      ServerHandler.sendMessageToEveryOne(
        io,
        socket,
        "game:unitUpdatePosition",
        {
          entity: unit.getEntity(),
          newPos: unit.getPosition(),
          direction,
        }
      );
    }
  };

  const unitDestinationReached = (entity: EntityType) => {
    const room: string = ServerHandler.getCurrentRoom(socket);
    const unit: Unit | undefined = StateManager.getUnit(room, entity);

    if (unit) {
      ServerHandler.sendMessageToEveryOne(
        io,
        socket,
        "game:unitDestinationReached",
        entity
      );
    }
  };

  const startAttack = (unit: EntityType): void => {
    ServerHandler.sendMessageToEveryOne(
      io,
      socket,
      "game:unitStartAttacking",
      unit
    );
  };

  const stopAttack = (unit: EntityType): void => {
    ServerHandler.sendMessageToEveryOne(
      io,
      socket,
      "game:unitStopAttacking",
      unit
    );
  };

  const dealDamage = ({
    unit,
    opponent,
  }: {
    unit: EntityType;
    opponent: EntityType;
  }): void => {
    const room: string = ServerHandler.getCurrentRoom(socket);
    const _unit: Unit | undefined = StateManager.getUnit(room, unit);
    const _opponent: Unit | undefined = StateManager.getUnit(room, opponent);

    if (_unit && _opponent) {
      _opponent.takeDamage(_unit.getDamage());

      if (_opponent.getHealth() > 0) {
        ServerHandler.sendMessageToEveryOne(io, socket, "game:unitDealDamage", {
          entity: _opponent.getEntity(),
          health: _opponent.getHealth(),
        });
      } else {
        ServerHandler.sendMessageToEveryOne(io, socket, "game:unitDies", {
          unit: _unit.getEntity(),
          opponent: _opponent.getEntity(),
        });
        stopAttack(unit);
        deleteUnit(_opponent);
      }
    }
  };

  const deleteUnit = (unit: Unit): void => {
    const room: string = ServerHandler.getCurrentRoom(socket);
    StateManager.deleteUnit(room, unit);
  };

  socket.on("game:unitCreate", unitCreate);

  socket.on("game:unitMoving", unitMoving);
  socket.on("game:unitUpdatePosition", unitUpdatePosition);
  socket.on("game:unitDestinationReached", unitDestinationReached);

  socket.on("game:unitStartAttacking", startAttack);
  socket.on("game:unitStopAttacking", stopAttack);
  socket.on("game:unitDealDamage", dealDamage);
};
