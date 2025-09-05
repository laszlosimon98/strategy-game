import { Socket } from "socket.io";
import { Indices } from "../utils/indices";
import { World } from "./world";
import { Validator } from "../validator";
import { Building } from "./building";
import { state } from "../../data/state";
import { Communicate } from "../communicate";
import { Cell } from "./cell";
import { EntityType } from "../../types/types";
import { MAP_SIZE } from "../../settings";
import { getImageNameFromUrl } from "../utils/utils";

export class Builder {
  private constructor() {}

  /**
   *
   * @param {number} xPos x koordináta
   * @param {number} yPos y koordináta
   * @param {Socket} socket kliens
   * @returns Megnézi, hogy szabad-e a cella
   */
  public static isPossibleToBuild = (
    xPos: number,
    yPos: number,
    socket: Socket
  ): boolean => {
    return World.getWorld(socket)[xPos][yPos].isBuildAble();
  };

  /**
   * Megnézi, hogy építhető-e, ha igen létrehozza az épületet és lerakja a cellára
   * @param {EntityType} entity az épület tulajdonságai
   * @param {Socket} socket kliens
   * @returns undefined ha nem építhető, az épület, ha építhető
   */
  public static build(
    entity: EntityType,
    socket: Socket
  ): Building | undefined {
    const { i, j } = entity.data.indices;

    if (!this.isPossibleToBuild(i, j, socket)) {
      return;
    }

    const world: Cell[][] = World.getWorld(socket);
    const newBuilding: Building = new Building(entity);
    const buildingName = getImageNameFromUrl(entity.data.url);

    newBuilding.setOwner(socket.id);

    state[Communicate.getCurrentRoom(socket)].players[socket.id].buildings.push(
      newBuilding
    );

    for (let l = 0; l < 2; ++l) {
      for (let k = 0; k < 2; ++k) {
        if (l === 1 && l === k) continue;
        if (i + l < MAP_SIZE && j + k < MAP_SIZE) {
          const cell: Cell = world[i + l][j + k];
          cell.setObstacle(true);
          cell.setObstacleType(buildingName);
        }
      }
    }

    return newBuilding;
  }

  /**
   * Lekérdezi a játékoshoz tartozó épületeket,
   * ellenőrzi, hogy a játékos illetve az épület tulajdonosa megegyezik, más játékos épületeit ne lehessen lerombolni,
   * törli a listából az épületet, ha koordináták megegyeznek
   * @param {Indices} indices koordináták
   * @param {Socket} socket kliens
   * @returns sikeres volt-e az épület lerombolása
   */
  public static destroy(indices: Indices, socket: Socket): boolean {
    const world: Cell[][] = World.getWorld(socket);
    const i = indices.i;
    const j = indices.j;

    if (world[i][j].cellHasObstacle()) {
      const buildings: Building[] =
        state[Communicate.getCurrentRoom(socket)].players[socket.id].buildings;

      for (let index = buildings.length - 1; index >= 0; --index) {
        const building: Building = buildings[index];
        const buildingIndices: Indices = building.getEntity().data.indices;

        if (
          !Validator.areSenderAndOwnerSame(
            socket,
            building.getEntity().data.owner
          )
        ) {
          return false;
        }

        if (buildingIndices.i === i && buildingIndices.j === j) {
          buildings.splice(index, 1);
        }
      }

      for (let l = 0; l < 2; ++l) {
        for (let k = 0; k < 2; ++k) {
          if (l === 1 && l === k) continue;
          if (i + l < MAP_SIZE && j + k < MAP_SIZE) {
            const cell: Cell = world[i + l][j + k];
            cell.setObstacle(false);
            cell.setObstacleType(null);
          }
        }
      }
      return true;
    }
    return false;
  }
}
