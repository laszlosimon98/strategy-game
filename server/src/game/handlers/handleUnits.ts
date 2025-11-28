import { Server, Socket } from "socket.io";
import { CommunicationHandler } from "@/communication/communicationHandler";
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

/**
 * Kezeli az egység létrehozását, törlését, mozgását és támadását.
 * @param io Socket.io szerver
 * @param socket Socket
 */
export const handleUnits = (io: Server, socket: Socket) => {
  /**
   * Csökkenti a raktár mennyiséget a létrehozáskor szükséges eszközökkel
   * @param room szoba azonosító
   * @param name katona neve
   */
  const calculateNewStorageValues = (room: string, name: string): void => {
    if (name === "knight") {
      StateManager.updateStorageItem(socket, room, "weapons", "sword", -1);
      StateManager.updateStorageItem(socket, room, "weapons", "shield", -1);
    } else {
      StateManager.updateStorageItem(socket, room, "weapons", "bow", -1);
    }
  };

  /**
   * Helper függvény az egység lekérdezéséhez
   * @param entity entitás
   * @returns Ha talált egységet akkor visszaadja azt
   */
  const getUnitHelper = (entity: EntityType): Unit | undefined => {
    const room: string = CommunicationHandler.getCurrentRoom(socket);
    if (!room) return;
    const unit: Unit | undefined = StateManager.getUnit(room, entity);
    if (!unit) return;

    return unit;
  };

  /**
   * Törli az egységet az állapottérből, törli az egységhez tartozó `target` értéket,
   * valamint a intervalt
   * @param unit törlendő egység
   * @returns
   */
  const deleteUnit = (unit: Unit): void => {
    const room: string = CommunicationHandler.getCurrentRoom(socket);
    if (!room) return;

    if (unit instanceof Soldier) {
      const players = StateManager.getPlayers(room);

      Object.values(players).forEach((player) => {
        player.units.forEach((otherUnit: Unit) => {
          if (otherUnit instanceof Soldier) {
            if (otherUnit.getTarget() === unit) {
              otherUnit.setTarget(null);

              const interval = otherUnit.getInterval();
              if (interval) {
                clearInterval(interval);
                otherUnit.setInterval(null);
              }
            }
          }
        });
      });
    }

    restoreCell(unit.getIndices());
    StateManager.deleteUnit(room, unit);
  };

  /**
   * Visszaállítja a cella értékeit a katona elesése után
   * @param indices vissza állítandó cella indexe
   * @returns
   */
  const restoreCell = (indices: Indices): void => {
    const { i, j } = indices;
    const room: string = CommunicationHandler.getCurrentRoom(socket);
    if (!room) return;

    const cell: Cell = StateManager.getWorld(room, socket)[i][j];
    cell.removeObstacle(ObstacleEnum.Unit);
    cell.setSoldier(null);
  };

  /**
   * Megvizsgálva az egységeket tartalmazó cellákat, visszaadja azokat, amelyek ellenséges egységek.
   * @param unitOnCells egységeket tartalmazó cella tömb
   * @returns
   */
  const getEnemySoldiersOnCells = (unitOnCells: Cell[]): Soldier[] => {
    return unitOnCells
      .map((cell) => {
        const soldier: Soldier | null = cell.getSoldier();
        return soldier;
      })
      .filter((soldier): soldier is Soldier => {
        if (!soldier) return false;

        const entity: EntityType | undefined = soldier?.getEntity();

        if (entity && entity.data.owner !== socket.id && soldier.isAlive()) {
          return true;
        }
        return false;
      });
  };

  /**
   * Létrehozza a katonát, majd elküldi a frissítéseket a klienseknek
   * @param room szoba azonosító
   * @param entity entitás adatok
   * @param response létrehozandó katona
   */
  const createSoldier = (
    room: string,
    entity: EntityType,
    response: Soldier
  ) => {
    calculateNewStorageValues(room, entity.data.name);
    const storage: StorageType = StateManager.getStorage(socket, room);

    CommunicationHandler.sendMessageToEveryOne(
      io,
      socket,
      "game:soldier-create",
      {
        entity: response.getEntity(),
        properties: response.getProperties(),
      }
    );

    CommunicationHandler.sendMessageToSender(socket, "game:storageUpdate", {
      storage,
    });
  };

  /**
   * Kezeli a klienstől érkezett egység létrehozás `request`-et
   * @param param0 entitás adatok
   * @returns
   */
  const handleSoldierCreation = ({ entity }: { entity: EntityType }): void => {
    if (!Validator.validateIndices(entity.data.indices)) {
      return;
    }

    const room = CommunicationHandler.getCurrentRoom(socket);
    if (!room) return;

    const response: Soldier | ReturnMessage = StateManager.createSoldier(
      socket,
      entity
    );

    if (!["knight", "archer"].includes(entity.data.name)) {
      CommunicationHandler.sendMessageToSender(socket, "game:info", {
        message: "Az egység nem lovag vagy íjász!",
      });

      return;
    }

    if (response instanceof Soldier) {
      createSoldier(room, entity, response);
    } else {
      CommunicationHandler.sendMessageToSender(socket, "game:info", response);
    }
  };

  /**
   * Meghatározza az útvonalat és megkezdi az egység elmozdítását.
   * @param param0 entitás adatok, cél indexek
   * @returns
   */
  const unitStartMovement = ({
    entity,
    goal,
  }: {
    entity: EntityType;
    goal: Indices;
  }): void => {
    if (!Validator.verifyOwner(socket, entity)) {
      CommunicationHandler.sendMessageToSender(socket, "game:info", {
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

  /**
   * Az alábbi függvény kezeli az egység mozgást, addig fog az egység mozogni, amig
   * el nem ért a cél cellára.
   * Folyamatosan szinkronban tartja a klienseket
   * @param entity entitás adatok
   * @returns
   */
  const unitMoving = (entity: EntityType): void => {
    const unit: Unit | undefined = getUnitHelper(entity);
    if (!unit) return;

    if (unit instanceof Soldier) {
      unit.setTarget(null);
    }

    const interval: NodeJS.Timeout | null = unit.getInterval();
    if (interval) {
      clearInterval(interval);
      unit.setInterval(null);
    }

    gameLoop((dt, interval) => {
      unit.move(dt);
      unit.setInterval(interval);

      const entity = {
        ...unit.getEntity(),
        data: {
          ...unit.getEntity().data,
          position: {
            x: Math.round(unit.getEntity().data.position.x),
            y: Math.round(unit.getEntity().data.position.y),
          },
        },
      };

      CommunicationHandler.sendMessageToEveryOne(
        io,
        socket,
        "game:unit-moving",
        {
          entity,
        }
      );

      if (!unit.isMoving()) {
        CommunicationHandler.sendMessageToEveryOne(
          io,
          socket,
          "game:unit-stop",
          {
            entity: unit.getEntity(),
          }
        );

        clearInterval(interval);
        unit.setInterval(null);
        return;
      }
    });
  };

  /**
   * Ha az egység tétlen, akkor véletlenszerű irányokban fog forogni
   * @param param0 entitás adatok
   * @returns
   */
  const unitChangeFacing = ({ entity }: { entity: EntityType }): void => {
    const unit: Unit | undefined = getUnitHelper(entity);
    if (!unit) return;

    unit.calculateNewIdleFacing();

    CommunicationHandler.sendMessageToEveryOne(io, socket, "game:unit-facing", {
      entity: unit.getEntity(),
    });
  };

  /**
   * Vizsgálja, hogy a katonák életben vannak-e még,
   * illetve figyeli, hogy ha a célpont elhagyta a támadási hatókört
   * @param currentSoldier jelenlegi katona
   * @param currentTarget jelenlegi célpont
   * @param enemySoldiers ellenséges katonák tömbje
   */
  const checkTarget = (
    currentSoldier: Soldier,
    currentTarget: Soldier | null,
    enemySoldiers: Soldier[]
  ): void => {
    if (currentTarget) {
      if (
        !currentTarget.isAlive() ||
        !currentSoldier.isTargetInRange(currentTarget)
      ) {
        currentSoldier.setTarget(null);
      }
    }

    if (!currentSoldier.getTarget()) {
      currentSoldier.setTarget(
        currentSoldier.getEnemySoldierInRange(enemySoldiers)
      );
    }
  };

  /**
   * Biztosítja, hogy harc közben a két katona egymás felé nézzen
   * @param room szoba azonosító
   * @param target célpont
   * @param currentSoldier jelenlegi katona
   */
  const handleCurrentAndTargetFacing = (
    room: string,
    target: Soldier,
    currentSoldier: Soldier
  ): void => {
    const targetCell = target.getCell(room);
    const currentCell = currentSoldier.getCell(room);
    if (targetCell && currentCell) {
      const facing = StateManager.calculateFacing(currentCell, targetCell);
      currentSoldier.setFacing(facing);

      CommunicationHandler.sendMessageToEveryOne(
        io,
        socket,
        "game:unit-facing",
        {
          entity: currentSoldier.getEntity(),
        }
      );
    }
  };

  /**
   * Kezeli a katona elhalálozásának logikáját
   * @param deadUnit elhalálozott egység
   * @param otherUnit másik egység
   */
  const handleUnitDeath = (
    deadUnit: Soldier,
    otherUnit: Soldier | null
  ): void => {
    deadUnit.setTarget(null);
    if (otherUnit) {
      otherUnit.setTarget(null);
    }
    deleteUnit(deadUnit);

    CommunicationHandler.sendMessageToEveryOne(io, socket, "game:unit-dies", {
      entity: deadUnit.getEntity(),
    });

    if (otherUnit && otherUnit.isAlive()) {
      CommunicationHandler.sendMessageToEveryOne(
        io,
        socket,
        "game:unit-stop-attacking",
        {
          entity: otherUnit.getEntity(),
        }
      );
    }
  };

  /**
   * Figyeli az adott katona körüli területet, ellenséget keresve.
   * Ha talált ellenséget, megkezdi a támadást
   * @param param0 entitás adatok
   * @returns
   */
  const checkSorroundings = ({ entity }: { entity: EntityType }): void => {
    const room: string = CommunicationHandler.getCurrentRoom(socket);
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
      ObstacleEnum.Unit,
      room
    );

    const enemySoldiers: Soldier[] = getEnemySoldiersOnCells(unitOnCells);
    const currentTarget: Soldier | null = currentSoldier.getTarget();

    checkTarget(currentSoldier, currentTarget, enemySoldiers);

    const target: Soldier | null = currentSoldier.getTarget();

    if (target && !currentSoldier.isMoving()) {
      CommunicationHandler.sendMessageToEveryOne(
        io,
        socket,
        "game:unit-start-attacking",
        { entity: currentSoldier.getEntity() }
      );

      handleCurrentAndTargetFacing(room, target, currentSoldier);
      currentSoldier.dealDamage(target);

      CommunicationHandler.sendMessageToEveryOne(
        io,
        socket,
        "game:unit-take-damage",
        {
          entity: target.getEntity(),
          health: target.getProperties().health,
        }
      );

      if (!target.isAlive()) {
        handleUnitDeath(target, currentSoldier);
      }

      if (!currentSoldier.isAlive()) {
        handleUnitDeath(currentSoldier, target);
      }
    } else {
      CommunicationHandler.sendMessageToEveryOne(
        io,
        socket,
        "game:unit-stop-attacking",
        {
          entity: currentSoldier.getEntity(),
        }
      );
    }
  };

  socket.on("game:soldier-create", handleSoldierCreation);
  socket.on("game:unit-start-movement", unitStartMovement);
  socket.on("game:unit-facing", unitChangeFacing);
  socket.on("game:unit-check-sorroundings", checkSorroundings);
};
