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
import { ObstacleEnum } from "@/enums/ObstacleEnum";
import { calculateDistance } from "@/utils/utils";
import { EPSILON, settings } from "@/settings";

export const handleUnits = (io: Server, socket: Socket) => {
  const calculateNewStorageValues = (room: string, name: string): void => {
    if (name === "knight") {
      StateManager.updateStorageItem(socket, room, "weapons", "sword", -1);
      StateManager.updateStorageItem(socket, room, "weapons", "shield", -1);
    } else {
      StateManager.updateStorageItem(socket, room, "weapons", "bow", -1);
    }
  };

  const getUnitHelper = (entity: EntityType): Unit | undefined => {
    const room: string = ServerHandler.getCurrentRoom(socket);
    if (!room) return;
    const unit: Unit | undefined = StateManager.getUnit(room, entity);
    if (!unit) return;

    return unit;
  };

  const getClosestUnit = (
    entity: EntityType,
    enemySoldiers: Soldier[]
  ): Soldier | undefined => {
    const room: string = ServerHandler.getCurrentRoom(socket);
    if (!room) return;

    const currentSoldier: Soldier = StateManager.getSoldier(
      room,
      entity
    ) as Soldier;
    let closestUnit: Soldier | undefined;

    for (let i = 0; i < enemySoldiers.length; ++i) {
      if (
        Math.floor(
          calculateDistance(
            currentSoldier.getPosition(),
            enemySoldiers[i].getPosition()
          )
        ) <
        currentSoldier.getProperties().range * settings.cellSize + EPSILON
      ) {
        closestUnit = enemySoldiers[i];
      }
    }

    return closestUnit;
  };

  const dealDamage = (currentSoldier: Soldier, enemySoldier: Soldier): void => {
    const damage: number = currentSoldier.getProperties().damage;
    enemySoldier.takeDamage(damage);
  };

  const deleteUnit = (unit: Unit): void => {
    const room: string = ServerHandler.getCurrentRoom(socket);
    if (!room) return;
    restoreCell(unit.getIndices());
    StateManager.deleteUnit(room, unit);
  };

  const restoreCell = (indices: Indices): void => {
    const { i, j } = indices;
    const cell: Cell = StateManager.getWorld(socket)[i][j];
    cell.removeObstacle(ObstacleEnum.Unit);
    cell.setSoldier(null);
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

  const unitStartMovement = ({
    entity,
    goal,
  }: {
    entity: EntityType;
    goal: Indices;
  }): void => {
    if (!Validator.verifyOwner(socket, entity)) {
      ServerHandler.sendMessageToSender(socket, "game:info", {
        message: "Csak saját egységet irányítható!",
      });
      return;
    }
    const unit: Unit | undefined = getUnitHelper(entity);
    if (!unit || StateManager.isPlayerLostTheGame(socket, entity)) return;

    unit.setGoal(goal);
    unit.calculatePath();
    setTimeout(() => unitMoving(entity), 50);
  };

  const unitMoving = (entity: EntityType): void => {
    const unit: Unit | undefined = getUnitHelper(entity);
    if (!unit) return;

    const interval: NodeJS.Timeout | null = unit.getInterval();
    if (interval) {
      clearInterval(interval);
    }

    gameLoop((dt, interval) => {
      unit.move(dt);
      unit.setInterval(interval);

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
    const unit: Unit | undefined = getUnitHelper(entity);
    if (!unit) return;

    unit.calculateNewIdleFacing();

    ServerHandler.sendMessageToEveryOne(io, socket, "game:unit-facing", {
      entity: unit.getEntity(),
    });
  };

  const checkSorroundings = ({ entity }: { entity: EntityType }): void => {
    const room: string = ServerHandler.getCurrentRoom(socket);
    if (!room) return;

    const currentSoldier: Soldier | undefined = StateManager.getSoldier(
      room,
      entity
    );
    if (!currentSoldier) return;

    const unitOnCells: Cell[] = StateManager.getWorldInRange(
      socket,
      currentSoldier.getIndices(),
      currentSoldier.getProperties().range,
      ObstacleEnum.Unit
    );

    const enemySoldiers: Soldier[] = unitOnCells
      .map((cell) => {
        const soldier: Soldier = cell.getSoldier() as Soldier;
        return soldier;
      })
      .filter((soldier) => {
        const entity: EntityType | undefined = soldier?.getEntity();

        if (entity && entity.data.owner !== socket.id) {
          return soldier;
        }
      });

    let closestEnemySoldier: Soldier | undefined;

    if (enemySoldiers.length > 0) {
      closestEnemySoldier = getClosestUnit(entity, enemySoldiers);
    }

    if (closestEnemySoldier) {
      ServerHandler.sendMessageToEveryOne(
        io,
        socket,
        "game:unit-start-attacking",
        { entity: currentSoldier.getEntity() }
      );

      const facing = StateManager.calculateFacing(
        currentSoldier.getCell(),
        closestEnemySoldier.getCell()
      );
      currentSoldier.setFacing(facing);

      ServerHandler.sendMessageToEveryOne(io, socket, "game:unit-facing", {
        entity: currentSoldier.getEntity(),
      });

      dealDamage(currentSoldier, closestEnemySoldier);

      ServerHandler.sendMessageToEveryOne(io, socket, "game:unit-take-damage", {
        entity: closestEnemySoldier.getEntity(),
        health: closestEnemySoldier.getProperties().health,
      });

      if (!currentSoldier.isAlive()) {
        deleteUnit(currentSoldier);

        ServerHandler.sendMessageToEveryOne(io, socket, "game:unit-dies", {
          entity: currentSoldier.getEntity(),
        });

        ServerHandler.sendMessageToEveryOne(
          io,
          socket,
          "game:unit-stop-attacking",
          {
            entity: closestEnemySoldier.getEntity(),
          }
        );
      }

      if (!closestEnemySoldier.isAlive()) {
        deleteUnit(closestEnemySoldier);

        ServerHandler.sendMessageToEveryOne(io, socket, "game:unit-dies", {
          entity: closestEnemySoldier.getEntity(),
        });

        ServerHandler.sendMessageToEveryOne(
          io,
          socket,
          "game:unit-stop-attacking",
          {
            entity: currentSoldier.getEntity(),
          }
        );
      }
    } else {
      ServerHandler.sendMessageToEveryOne(
        io,
        socket,
        "game:unit-stop-attacking",
        {
          entity: currentSoldier.getEntity(),
        }
      );
    }
  };

  socket.on("game:soldier-create", soldierCreate);
  socket.on("game:unit-start-movement", unitStartMovement);
  socket.on("game:unit-facing", unitChangeFacing);
  socket.on("game:unit-check-sorroundings", checkSorroundings);
};
