import { Server, Socket } from "socket.io";
import { ServerHandler } from "@/server/serverHandler";
import { Building } from "@/game/building";
import { Validator } from "@/utils/validator";
import type { EntityType } from "@/types/state.types";
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

export const handleBuildings = (io: Server, socket: Socket) => {
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

  const build = (entity: EntityType): void => {
    if (
      !Validator.validateIndices(entity.data.indices) ||
      StateManager.isPlayerLostTheGame(socket, entity)
    ) {
      return;
    }
    const room: string = ServerHandler.getCurrentRoom(socket);
    if (!room) return;

    const response: Building | ReturnMessage = StateManager.createBuilding(
      socket,
      entity
    );

    if (response instanceof Building) {
      calculateNewStorageValues(room, response);

      const storage: StorageType = StateManager.getStorage(socket, room);

      ServerHandler.sendMessageToEveryOne(
        io,
        socket,
        "game:build",
        response.getEntity()
      );

      if (response instanceof GuardHouse) {
        const updatedCells: Cell[] = World.updateTerritory(socket);

        ServerHandler.sendMessageToEveryOne(
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

      ServerHandler.sendMessageToSender(socket, "game:storageUpdate", {
        storage,
      });
    } else {
      ServerHandler.sendMessageToSender(socket, "game:info", response);
    }
  };

  const destroy = (
    entity: EntityType,
    needValidation: boolean = true
  ): void => {
    if (!Validator.validateIndices(entity.data.indices)) {
      return;
    }

    const cells: DestroyBuildingResponse | null = StateManager.destroyBuilding(
      socket,
      entity,
      needValidation
    );

    if (cells === null) {
      ServerHandler.sendMessageToSender(socket, "game:info", {
        message: "Sikertelen épület elbontás!",
      });
      return;
    }

    ServerHandler.sendMessageToEveryOne(io, socket, "game:destroy", {
      id: socket.id,
      entity,
    });

    ServerHandler.sendMessageToSender(socket, "game:info", {
      message: "Épület sikeresen elbontva!",
    });

    if (entity.data.name === "guardhouse") {
      ServerHandler.sendMessageToEveryOne(io, socket, "game:updateTerritory", {
        data: cells.markedCells.map((cell) => {
          return {
            indices: cell.getIndices(),
            owner: cell.getOwner(),
            obstacle: cell.getHighestPriorityObstacleType(),
          };
        }),
      });

      ServerHandler.sendMessageToEveryOne(io, socket, "game:updateTerritory", {
        data: cells.updatedCells.map((cell) => {
          return {
            indices: cell.getIndices(),
            owner: cell.getOwner(),
            obstacle: cell.getHighestPriorityObstacleType(),
          };
        }),
      });

      ServerHandler.sendMessageToEveryOne(
        io,
        socket,
        "game:destroyLostTerritoryBuildings",
        {
          id: socket.id,
          entities: cells.lostBuildings.map((building) => building.getEntity()),
        }
      );

      if (StateManager.isPlayerLostTheGame(socket, entity)) {
        const room: string = ServerHandler.getCurrentRoom(socket);
        if (!room) return;

        const user = StateManager.getPlayer(room, socket);

        ServerHandler.sendMessageToEveryOne(io, socket, "chat:message", {
          message: `${user.name} kiesett a játékból!`,
          name: "Rendszer",
          color: "#000",
        });
      }

      if (StateManager.isGameOver(socket)) {
        setTimeout(() => {
          ServerHandler.sendMessageToEveryOne(io, socket, "chat:message", {
            message: `${StateManager.getWinner(socket)} megnyerte a játékot!`,
            name: "Rendszer",
            color: "#000",
          });
        }, 1000);
      }
    }
  };

  const guardHouseCheck = ({ entity }: { entity: EntityType }): void => {
    const room: string = ServerHandler.getCurrentRoom(socket);
    if (!room) return;

    const guardHouse: GuardHouse = StateManager.getBuildingByEntity(
      room,
      entity
    ) as GuardHouse;

    if (guardHouse.isCapturable(socket, room)) {
      const enemyOwner = guardHouse.capturingBy(socket, room);
      if (!enemyOwner) return;

      console.log("start occupation");
      ServerHandler.sendMessageToEveryOne(
        io,
        socket,
        "game:guardhouse-start-occupation",
        { entity, enemyOwner }
      );
    }
  };

  const reBuild = (entity: EntityType): void => {
    const response: Building | ReturnMessage = StateManager.createBuilding(
      socket,
      entity,
      false
    );

    if (response instanceof Building) {
      ServerHandler.sendMessageToEveryOne(
        io,
        socket,
        "game:build",
        response.getEntity()
      );

      if (response instanceof GuardHouse) {
        const updatedCells: Cell[] = World.updateTerritory(socket);

        ServerHandler.sendMessageToEveryOne(
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
    } else {
      ServerHandler.sendMessageToSender(socket, "game:info", {
        message: "Őrtorony sikeresen elfoglalva!",
      });
    }
  };

  const guardHouseOccupied = ({ entity }: { entity: EntityType }): void => {
    const room: string = ServerHandler.getCurrentRoom(socket);
    if (!room) return;

    destroy(entity, false);
    entity.data.owner = socket.id;
    entity.data.position = calculatePositionFromIndices(entity.data.indices);
    const { i, j } = entity.data.indices;
    StateManager.getWorld(room, socket)[i][j].setOwner(entity.data.owner);
    reBuild(entity);
  };

  socket.on("game:build", build);
  socket.on("game:destroy", destroy);
  socket.on("game:guardhouse-check", guardHouseCheck);
  socket.on("game:guardhouse-occupied", guardHouseOccupied);
};
