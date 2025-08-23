import { Socket } from "socket.io";
import { EntityType, Position } from "../../types/types";
import { state } from "../../data/state";
import { Communicate } from "../communicate";
import { Unit } from "../game/unit";

/**
 *
 * @param socket kliens
 * @param entity keresett entity (Unit)
 * @returns Megkeresi az adott klienshez, tartozó Unit-ot
 */
export const getUnit = (
  socket: Socket,
  entity: EntityType
): Unit | undefined => {
  const units: Unit[] =
    state[Communicate.getCurrentRoom(socket)].players[entity.data.owner].units;

  const unit: Unit | undefined = units.find(
    (unit) => unit.getEntity().data.id === entity.data.id
  );

  return unit;
};

/**
 *
 * @param {Position} from
 * @param {Position} to
 * @returns kiszámolja a távolságot két pozíció között
 */
export const calculateDistance = (from: Position, to: Position): number => {
  const x = to.x - from.x;
  const y = to.y - from.y;
  const distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  return distance;
};

/**
 *
 * @param {number} min minimum
 * @param {number} max maximum
 * @returns visszaad egy random számot a megadott intervalumból
 */
export const getRandomNumberFromInterval = (
  min: number,
  max: number
): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

/**
 *
 * @param {string} url
 * @returns kinyeri a kép nevét a megadott url-ből
 */
export const getImageNameFromUrl = (url: string): string => {
  const split = url.split("/");
  const length = split.length;

  return split[length - 1].split(".")[0];
};
