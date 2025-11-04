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
import { Indices } from "@/utils/indices";
import { gameLoop } from "@/game/loop/gameLoop";
import { PathFinder } from "@/game/pathFind/pathFinder";
import { ObstacleEnum } from "@/enums/ObstacleEnum";

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
    const path: Indices[] = PathFinder.getPath(socket, start, end);

    return path;
  };

  const unitPrepareForMovement = (entity: EntityType, goal: Indices): void => {
    const room: string = ServerHandler.getCurrentRoom(socket);
    if (!room) return;
    const unit: Unit | undefined = StateManager.getUnit(room, entity);

    if (!unit) return;

    const path: Indices[] | undefined = calculatePath(
      entity,
      unit.getIndices(),
      goal
    );
    if (!path) return;

    const world: Cell[][] = StateManager.getWorld(socket);
    const cellPath: Cell[] = [];

    path.forEach((p) => {
      const { i, j } = p;
      cellPath.push(world[i][j]);
    });

    unit.setPath(cellPath);
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
  const unitStartMovement = ({
    entity,
    goal,
  }: {
    entity: EntityType;
    goal: Indices;
  }): void => {
    const room: string = ServerHandler.getCurrentRoom(socket);
    if (!room || StateManager.isPlayerLostTheGame(socket, entity)) return;

    const unit: Unit | undefined = StateManager.getUnit(room, entity);

    if (!unit) return;

    unitPrepareForMovement(unit.getEntity(), goal);
    setTimeout(() => unitMoving(entity), 50);
  };

  const unitMoving = (entity: EntityType): void => {
    const room: string = ServerHandler.getCurrentRoom(socket);
    const unit: Unit | undefined = StateManager.getUnit(room, entity);
    if (!unit) return;

    gameLoop((dt, interval) => {
      unit.move(dt);

      ServerHandler.sendMessageToEveryOne(io, socket, "game:unit-moving", {
        entity: unit.getEntity(),
      });

      if (!unit.isMoving()) {
        ServerHandler.sendMessageToEveryOne(io, socket, "game:unit-stop", {
          entity: unit.getEntity(),
        });

        clearInterval(interval);
        return;
      }
    });
  };

  const unitChangeFacing = ({ entity }: { entity: EntityType }): void => {
    const room: string = ServerHandler.getCurrentRoom(socket);
    if (!room) return;
    const unit: Unit | undefined = StateManager.getUnit(room, entity);
    if (!unit) return;

    unit.calculateNewIdleFacing();

    ServerHandler.sendMessageToEveryOne(io, socket, "game:unit-idle-facing", {
      entity: unit.getEntity(),
    });
  };

  const checkSorroundings = ({ entity }: { entity: EntityType }): void => {
    const room: string = ServerHandler.getCurrentRoom(socket);
    if (!room) return;
    const soldier: Soldier | undefined = StateManager.getSoldier(room, entity);
    if (!soldier) return;

    const unitOnCells: Cell[] = StateManager.getWorldInRange(
      socket,
      soldier.getIndices(),
      soldier.getProperties().range,
      ObstacleEnum.Unit
    );

    const enemyUnits: Unit[] = unitOnCells
      .map((cell) => {
        const unit: Unit | null = cell.getUnit() as Unit;
        return unit;
      })
      .filter((unit) => {
        const entity: EntityType | undefined = unit?.getEntity();

        if (
          entity &&
          entity.data.owner !== socket.id &&
          entity.data.id !== soldier.getEntity().data.id
        ) {
          return unit;
        }
      });

    console.log("Enemy: ", enemyUnits);
  };

  const deleteUnit = (unit: Unit): void => {
    const room: string = ServerHandler.getCurrentRoom(socket);
    StateManager.deleteUnit(room, unit);
  };

  socket.on("game:soldier-create", soldierCreate);
  socket.on("game:unit-start-movement", unitStartMovement);
  socket.on("game:unit-idle-facing", unitChangeFacing);
  socket.on("game:unit-check-sorroundings", checkSorroundings);
};
