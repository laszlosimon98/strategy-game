import { Position } from "@/utils/position";
import { Indices } from "@/utils/indices";
import { settings } from "@/settings";

/**
 * Kiszámolja két pozíció távolságát
 * @param from kezdő pozíció
 * @param to cél pozíció
 * @returns két pozíció távolsága
 */
export const calculateDistance = (from: Position, to: Position): number => {
  const x = to.x - from.x;
  const y = to.y - from.y;
  const distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  return distance;
};

/**
 * Kiszámolja a kezdő és a cél index távolságát
 * @param from kezdő index
 * @param to cél index
 * @returns kezdő és cél index távolsága
 */
export const calculateDistanceByIndices = (
  from: Indices,
  to: Indices
): number => {
  const i = to.i - from.i;
  const j = to.j - from.j;
  const distance = Math.sqrt(Math.pow(i, 2) + Math.pow(j, 2));
  return distance;
};

/**
 * Visszaadd egy véletlen számot a minimum és maximum érték között
 * @param min minimum érték
 * @param max maximum érték
 * @returns véletlen szám a minimum és maximum érték között
 */
export const getRandomNumberFromInterval = (
  min: number,
  max: number
): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

/**
 * Kinyeri az url-ből az kép nevét
 * @param url
 * @returns kép neve
 */
export const getImageNameFromUrl = (url: string): string => {
  const split = url.split("/");
  const length = split.length;

  return split[length - 1].split(".")[0];
};

/**
 * Visszaadd egy véletlen elemet a paraméterben megadott tömből
 * @param arr tömb
 * @returns véletlen elem a tömből
 */
export const getRandomElementFromArray = <T>(arr: T[]): T => {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
};

/**
 * Kiszámolja a pozíciót a megadott indexből
 * @param indices indexek
 * @returns kiszámolt pozíció
 */
export const calculatePositionFromIndices = (indices: Indices): Position => {
  const { i, j } = indices;

  const normalPos = new Position(
    i * settings.cellSize + settings.cellSize,
    j * settings.cellSize + settings.cellSize
  );

  const isometricPos = new Position(
    normalPos.x - normalPos.y,
    (normalPos.x + normalPos.y) / 2
  );

  return isometricPos;
};
