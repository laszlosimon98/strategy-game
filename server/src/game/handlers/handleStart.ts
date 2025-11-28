import { v4 as uuidv4 } from "uuid";
import { Server, Socket } from "socket.io";
import { CommunicationHandler } from "@/communication/communicationHandler";
import { World } from "@/game/world";
import { Indices } from "@/utils/indices";
import type { EntityType, PlayerType } from "@/types/state.types";
import { settings } from "@/settings";
import { StateManager } from "@/manager/stateManager";
import { Building } from "@/game/buildings/building";
import { ReturnMessage } from "@/types/setting.types";
import { Cell } from "@/game/cell";
import { calculatePositionFromIndices } from "@/utils/utils";

/**
 * A játék inicializálásáért felelő függvény
 * @param io Socket.IO szerver
 * @param socket csatlakozott kliens
 */
export const handleStart = (io: Server, socket: Socket) => {
  /**
   * Megvizsgálja, hogy legalább 2 játékos van a szobába, majd elindítja a játékot
   * Inicializálja a játékosokat a szobába, meghívva a World osztály metódusát, létrehozza a világot
   * Elhelyezi a játékosok tornyait a kezdőpozícióra
   * @returns
   */
  const gameStarts = async () => {
    const room: string = CommunicationHandler.getCurrentRoom(socket);
    if (!room) return;

    if (Object.keys(StateManager.getPlayers(room)).length <= 1) {
      CommunicationHandler.sendMessageToSender(
        socket,
        "connect:error",
        "A játék egy játékossal nem indítható!"
      );
      return;
    }

    StateManager.startGame(room);
    CommunicationHandler.sendMessageToEveryOne(io, socket, "game:starts", {});

    initPlayers(room);
    createWorld();
    initPlayersStartPosition(room);
  };

  /**
   * Elküldi a klienseknek a játékosok adatait
   * @param room szoba azonosító
   */
  const initPlayers = (room: string) => {
    CommunicationHandler.sendMessageToEveryOne(
      io,
      socket,
      "game:initPlayers",
      StateManager.getPlayers(room)
    );
  };

  /**
   * Világ létrehozása
   * @returns
   */
  const createWorld = () => {
    const room: string = CommunicationHandler.getCurrentRoom(socket);
    if (!room) return;

    World.createWorld(socket);

    CommunicationHandler.sendMessageToEveryOne(io, socket, "game:createWorld", {
      tiles: World.getTiles(socket, room),
      obstacles: World.getObstacles(socket, room),
    });
  };

  /**
   * Kezdeti kamera pozíciók meghatározása
   * @param room szoba azonosító
   */
  const initPlayersStartPosition = (room: string): void => {
    const players: PlayerType = StateManager.getPlayers(room);
    const startPositions: Indices[] = [...settings.startPositions];

    Object.keys(players).forEach((id) => {
      const idx: number = Math.floor(Math.random() * startPositions.length);
      const pos = startPositions.splice(idx, 1)[0];
      CommunicationHandler.sendPrivateMessage(io, id, "game:startPos", pos);

      placeTower(id, pos);
      updateTerritory();
    });
  };

  /**
   * Elhelyezi a kezdeti pozícióra a játékos tornyát
   * @param playerId játékos azonosítója
   * @param indices torony építéshez szükséges indexek
   * @returns sikeres építés esetén visszaadja az épített épületet
   */
  const placeTower = (playerId: string, indices: Indices): Building | null => {
    const entity: EntityType = {
      data: {
        id: uuidv4(),
        owner: playerId,
        url: `http://${process.env.HOST}:${process.env.PORT}/assets/buildings/guardhouse.png`,
        static: "",
        indices,
        dimensions: {
          width: 128,
          height: 128,
        },
        position: calculatePositionFromIndices(indices),
        name: "guardhouse",
        productionTime: 0,
        cooldownTimer: 0,
        attackTimer: 0,
        healingTimer: 0,
        isProductionBuilding: false,
        facing: 0,
      },
    };

    const { i, j } = indices;
    const room: string = CommunicationHandler.getCurrentRoom(socket);
    if (!room) return null;

    StateManager.getWorld(room, socket)[i][j].setOwner(playerId);

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
      return response;
    } else {
      CommunicationHandler.sendMessageToSender(socket, "game:info", response);
      return null;
    }
  };

  /**
   * Frissíti a torony által meghatározott játékos területét, majd elküldi a résztvevőknek
   */
  const updateTerritory = () => {
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
  };

  socket.on("game:starts", gameStarts);
};
