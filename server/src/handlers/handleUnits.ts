import { Server, Socket } from "socket.io";
import { ServerHandler } from "@/server/serverHandler";
import { Unit } from "@/game/units/unit";
import { Validator } from "@/utils/validator";
import type { EntityType } from "@/types/state.types";
import { StateManager } from "@/manager/stateManager";
import { ReturnMessage } from "@/types/setting.types";
import { StorageType } from "@/types/storage.types";
import { Soldier } from "@/game/units/soldier";
import { Cell } from "@/game/cell";
import { AStar } from "@/pathFind/astar";
import { Indices } from "@/utils/indices";
import { Position } from "@/utils/position";

export const handleUnits = (io: Server, socket: Socket) => {
  const calculatePath = (
    entity: EntityType,
    start: Indices,
    end: Indices
  ): Indices[] | undefined => {
    if (!Validator.verifyOwner(socket, entity)) {
      ServerHandler.sendMessageToSender(socket, "game:info", {
        message: "Csak saját egységet irányítható!",
      });

      return;
    }

    const world: Cell[][] = StateManager.getWorld(socket);

    const startCell: Cell = world[start.i][start.j];
    const endCell: Cell = world[end.i][end.j];
    const path: Indices[] = AStar.getPath(startCell, endCell);

    return path;
  };

  const setUnitStartIndices = (entity: EntityType): Unit | undefined => {
    const room: string = ServerHandler.getCurrentRoom(socket);

    const indices = entity.data.indices;
    const unit: Unit | undefined = StateManager.getUnit(room, entity);

    if (!unit) return undefined;
    unit.setIndices(indices);

    return unit;
  };

  const calculateNewStorageValues = (room: string, name: string): void => {
    if (name === "knight") {
      StateManager.updateStorageItem(socket, room, "weapons", "sword", -1);
      StateManager.updateStorageItem(socket, room, "weapons", "shield", -1);
    } else {
      StateManager.updateStorageItem(socket, room, "weapons", "bow", -1);
    }
  };

  const soldierCreate = ({ entity }: { entity: EntityType }): void => {
    if (!Validator.validateIndices(entity.data.indices)) {
      return;
    }

    const room = ServerHandler.getCurrentRoom(socket);
    const response: Soldier | ReturnMessage = StateManager.createSoldier(
      socket,
      entity
    );

    if (!["knight", "archer"].includes(entity.data.name)) {
      ServerHandler.sendMessageToSender(socket, "game:info", {
        message: "Az egység nem lovag vagy íjász!",
      });

      return;
    }

    if (response instanceof Soldier) {
      calculateNewStorageValues(room, entity.data.name);
      const storage: StorageType = StateManager.getStorage(socket, room);

      ServerHandler.sendMessageToEveryOne(io, socket, "game:soldier-create", {
        entity: response.getEntity(),
        properties: response.getProperties(),
      });

      ServerHandler.sendMessageToSender(socket, "game:storageUpdate", {
        storage,
      });
    } else {
      ServerHandler.sendMessageToSender(socket, "game:info", response);
    }
  };

  /**
   *
   * @param {Object} entity
   * @returns
   */
  const unitUpdatePosition = ({ entity }: { entity: EntityType }): void => {
    const room: string = ServerHandler.getCurrentRoom(socket);

    const position: Position = entity.data.position;
    const unit: Unit | undefined = StateManager.getUnit(room, entity);

    if (!unit) return;
    unit.setPosition(position);

    ServerHandler.sendMessageToEveryOne(
      io,
      socket,
      "game:unit-update-position",
      { entity }
    );
  };

  const unitMove = ({
    entity,
    goal,
  }: {
    entity: EntityType;
    goal: Indices;
  }): void => {
    const unit: Unit | undefined = setUnitStartIndices(entity);

    if (!unit) return;

    const path: Indices[] | undefined = calculatePath(
      entity,
      unit.getIndices(),
      goal
    );

    if (!path) return;

    ServerHandler.sendMessageToEveryOne(io, socket, "game:unit-move", {
      entity,
      path,
    });
  };

  const unitReachedDestination = ({ entity }: { entity: EntityType }): void => {
    setUnitStartIndices(entity);
  };

  const unitChangeFacing = ({ entity }: { entity: EntityType }): void => {
    const unit: Unit | undefined = setUnitStartIndices(entity);
    if (!unit) return;

    const facing = unit.calculateNewIdleFacing();

    ServerHandler.sendMessageToEveryOne(io, socket, "game:unit-idle-facing", {
      entity,
      facing,
    });
  };

  const deleteUnit = (unit: Unit): void => {
    const room: string = ServerHandler.getCurrentRoom(socket);
    StateManager.deleteUnit(room, unit);
  };

  socket.on("game:soldier-create", soldierCreate);
  socket.on("game:unit-move", unitMove);
  socket.on("game:unit-update-position", unitUpdatePosition);
  socket.on("game:unit-reached-destination", unitReachedDestination);
  socket.on("game:unit-idle-facing", unitChangeFacing);
};
