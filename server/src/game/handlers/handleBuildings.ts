import { Server, Socket } from "socket.io";
import { CommunicationHandler } from "@/communication/communicationHandler";
import { Building } from "@/game/buildings/building";
import { Validator } from "@/utils/validator";
import type { EntityType, PlayerType } from "@/types/state.types";
import { StateManager } from "@/manager/stateManager";
import { ReturnMessage } from "@/types/setting.types";
import { StorageType } from "@/types/storage.types";
import { Buildings } from "@/types/building.types";
import {
  calculatePositionFromIndices,
  getImageNameFromUrl,
} from "@/utils/utils";
import { World } from "@/game/world";
import { GuardHouse } from "@/game/buildings/military/guardhouse";
import { Cell } from "@/game/cell";
import { DestroyBuildingResponse } from "@/types/world.types";

/**
 * Kezeli az épületekkel kapcsolatos logikát,
 *  - építés
 *  - elbontás
 *  - raktár frissítés
 * @param io Socket.IO szerver
 * @param socket csatlakozott kliens
 */
export const handleBuildings = (io: Server, socket: Socket) => {
  /**
   * Csökkenti a raktár mennyiséget, az épülethez szükséges költségekkel
   * @param room szoba azonosító
   * @param building épített épület
   */
  const calculateNewStorageValues = (
    room: string,
    building: Building
  ): void => {
    const buildingName: string = getImageNameFromUrl(
      building.getEntity().data.url
    );

    const { boards: boardsAmount, stone: stoneAmount } =
      StateManager.getBuidingPrices()[buildingName as Buildings];

    StateManager.updateStorageItem(
      socket,
      room,
      "materials",
      "boards",
      -boardsAmount
    );

    StateManager.updateStorageItem(
      socket,
      room,
      "materials",
      "stone",
      -stoneAmount
    );
  };

  /**
   * Kezeli az épület építés logikáját, és elküldi a változásokat a kliensnek
   * @param entity entitás adatok
   * @returns
   */
  const build = (entity: EntityType): void => {
    if (
      !Validator.validateIndices(entity.data.indices) ||
      StateManager.isPlayerLostTheGame(socket, entity)
    ) {
      return;
    }
    const room: string = CommunicationHandler.getCurrentRoom(socket);
    if (!room) return;

    const response: Building | ReturnMessage = StateManager.createBuilding(
      socket,
      entity
    );

    if (response instanceof Building) {
      calculateNewStorageValues(room, response);

      const storage: StorageType = StateManager.getStorage(socket, room);

      CommunicationHandler.sendMessageToEveryOne(
        io,
        socket,
        "game:build",
        response.getEntity()
      );

      if (response instanceof GuardHouse) {
        const updatedCells: Cell[] = World.updateTerritory(socket);

        CommunicationHandler.sendMessageToEveryOne(
          io,
          socket,
          "game:updateTerritory",
          {
            data: updatedCells.map((cell) => {
              return {
                indices: cell.getIndices(),
                owner: cell.getOwner(),
                obstacle: cell.getHighestPriorityObstacleType(),
              };
            }),
          }
        );
      }

      CommunicationHandler.sendMessageToSender(socket, "game:storageUpdate", {
        storage,
      });
    } else {
      CommunicationHandler.sendMessageToSender(socket, "game:info", response);
    }
  };

  /**
   * Kezeli az épület elbontásával kapcsolatos, logikát.
   * Vizsgálja, hogy a játéknak vége van-e, ha igen, akkor statisztika frissítő hívásokat tesz.
   * A változásokat elküldi a klienseknek
   * @param entity entitás adatok
   * @param needValidation szükséges-e validáció az épület elbontásához
   * @returns
   */
  const destroy = async (
    entity: EntityType,
    needValidation: boolean = true
  ): Promise<void> => {
    if (!Validator.validateIndices(entity.data.indices)) {
      return;
    }

    const room: string = CommunicationHandler.getCurrentRoom(socket);
    if (!room) return;

    const user = StateManager.getPlayers(room)[entity.data.owner];
    if (!user) return;

    const cells: DestroyBuildingResponse | null = StateManager.destroyBuilding(
      socket,
      entity,
      needValidation
    );

    if (cells === null) {
      CommunicationHandler.sendMessageToSender(socket, "game:info", {
        message: "Sikertelen épület elbontás!",
      });
      return;
    }

    CommunicationHandler.sendMessageToEveryOne(io, socket, "game:destroy", {
      id: socket.id,
      entity,
    });

    CommunicationHandler.sendMessageToSender(socket, "game:info", {
      message: "Épület sikeresen elbontva!",
    });

    if (entity.data.name === "guardhouse") {
      sendGuardHouseRelatedMessages(cells);

      if (StateManager.isPlayerLostTheGame(socket, entity)) {
        StateManager.updateStatistic(user.name, "lose");
        StateManager.setPlayerStatisticToUpdated(user);

        CommunicationHandler.sendMessageToEveryOne(io, socket, "chat:message", {
          message: `${user.name} kiesett a játékból!`,
          name: "Rendszer",
          color: "#000",
        });
      }

      if (StateManager.isGameOver(socket)) {
        const winner: string | null = StateManager.getWinner(socket);
        if (!winner) return;

        const user: PlayerType[""] | undefined = StateManager.getPlayerByName(
          room,
          winner
        );
        if (!user) return;

        StateManager.updateStatistic(winner, "win");
        StateManager.setPlayerStatisticToUpdated(user);

        setTimeout(() => {
          CommunicationHandler.sendMessageToEveryOne(
            io,
            socket,
            "chat:message",
            {
              message: `${winner} megnyerte a játékot!`,
              name: "Rendszer",
              color: "#000",
            }
          );
        }, 1000);
      }
    }
  };

  /**
   * Ellenőrzi, hogy az őrtorony foglalható, ha igen akkor foglalja-e valaki.
   * Értesítés küld a klienseknek ha elkezdődött a foglalás, illetve ha megszakadt
   * @param param0 entitás adatok
   * @returns
   */
  const guardHouseCheck = ({ entity }: { entity: EntityType }): void => {
    const room: string = CommunicationHandler.getCurrentRoom(socket);
    if (!room) return;

    const guardHouse: GuardHouse | undefined = StateManager.getBuildingByEntity(
      room,
      entity
    );

    if (guardHouse && guardHouse.isCapturable(socket, room)) {
      const enemyOwner = guardHouse.capturingBy(socket, room);
      if (!enemyOwner) return;

      CommunicationHandler.sendMessageToEveryOne(
        io,
        socket,
        "game:guardhouse-start-occupation",
        { entity, enemyOwner }
      );
    } else {
      CommunicationHandler.sendMessageToEveryOne(
        io,
        socket,
        "game:guardhouse-stop-occupation",
        { entity }
      );
    }
  };

  /**
   * Elfoglalás után újra építés logika
   * @param entity entitás adatok
   */
  const reBuild = (entity: EntityType): void => {
    const response: Building | ReturnMessage = StateManager.createBuilding(
      socket,
      entity,
      false
    );

    if (response instanceof Building) {
      CommunicationHandler.sendMessageToEveryOne(
        io,
        socket,
        "game:build",
        response.getEntity()
      );

      if (response instanceof GuardHouse) {
        const updatedCells: Cell[] = World.updateTerritory(socket);

        CommunicationHandler.sendMessageToEveryOne(
          io,
          socket,
          "game:updateTerritory",
          {
            data: updatedCells.map(formatCell),
          }
        );
      }
    } else {
      CommunicationHandler.sendMessageToSender(socket, "game:info", {
        message: "Őrtorony sikeresen elfoglalva!",
      });
    }
  };

  /**
   * Őrtorony elfoglalásának menete
   * @param param0 entitás adatok
   * @returns
   */
  const guardHouseOccupied = ({ entity }: { entity: EntityType }): void => {
    const room: string = CommunicationHandler.getCurrentRoom(socket);
    if (!room) return;

    destroy(entity, false);
    entity.data.owner = socket.id;
    entity.data.position = calculatePositionFromIndices(entity.data.indices);
    const { i, j } = entity.data.indices;
    StateManager.getWorld(room, socket)[i][j].setOwner(entity.data.owner);
    reBuild(entity);
  };

  const formatCell = (cell: Cell) => ({
    indices: cell.getIndices(),
    owner: cell.getOwner(),
    obstacle: cell.getHighestPriorityObstacleType(),
  });

  const sendGuardHouseRelatedMessages = (cells: DestroyBuildingResponse) => {
    CommunicationHandler.sendMessageToEveryOne(
      io,
      socket,
      "game:updateTerritory",
      {
        data: cells.markedCells.map(formatCell),
      }
    );

    CommunicationHandler.sendMessageToEveryOne(
      io,
      socket,
      "game:updateTerritory",
      {
        data: cells.updatedCells.map(formatCell),
      }
    );

    CommunicationHandler.sendMessageToEveryOne(
      io,
      socket,
      "game:destroyLostTerritoryBuildings",
      {
        id: socket.id,
        entities: cells.lostBuildings.map((building) => building.getEntity()),
      }
    );
  };

  socket.on("game:build", build);
  socket.on("game:destroy", destroy);
  socket.on("game:guardhouse-check", guardHouseCheck);
  socket.on("game:guardhouse-occupied", guardHouseOccupied);
};
