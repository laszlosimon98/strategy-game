import type { GameMenu } from "@/game/menu/gameMenu";
import { Entity } from "@/game/world/entity";
import { settings } from "@/settings";
import { Indices } from "@/utils/indices";
import { Position } from "@/utils/position";

/**
 * Visszaadja az url-ből a kép nevét.
 * @param url
 * @returns
 */
export const getImageNameFromUrl = (url: string): string => {
  const split = url.split("/");
  const length = split.length;

  return split[length - 1].split(".")[0];
};

/**
 * Megvizsgálja, hogy az egér metszi-e az objektumot
 * @param mousePos egér koordináta
 * @param element objektum
 * @returns metszi-e az egér az objektumot
 */
export const isMouseIntersect = (
  mousePos: Position,
  element: Entity | GameMenu
): boolean => {
  const horizontal =
    mousePos.x >= element.getPosition().x &&
    mousePos.x <= element.getPosition().x + element.getDimension().width;
  const vertical =
    mousePos.y >= element.getPosition().y &&
    mousePos.y <= element.getPosition().y + element.getDimension().height;
  return horizontal && vertical;
};

/**
 * Átalakítja az isometrikus koordinátákat cella indexeké
 * @param position megadott koordináta
 * @param cameraScroll kamera elmozdulás
 * @returns cella index
 */
export const convertIsometricCoordsToCartesianCoords = (
  position: Position,
  cameraScroll: Position
): Indices => {
  const world_x = position.x - cameraScroll.x;
  const world_y = position.y - cameraScroll.y;

  const cart_y = (2 * world_y - world_x) / 2;
  const cart_x = cart_y + world_x;

  const grid_x = Math.floor(cart_x / settings.size.cell);
  const grid_y = Math.floor(cart_y / settings.size.cell);

  return new Indices(grid_x, grid_y);
};

/**
 * Átalakítja a kartéziánus koordinátákat isometrius koordinátáká
 * @param pos megadott koordináta
 * @returns isometrikus koordináta
 */
export const cartesianToIsometric = (pos: Position): Position => {
  const { x, y } = pos;
  const isoX = (x - y) * Math.cos(Math.PI / 6);
  const isoY = (x + y) * Math.sin(Math.PI / 6);
  return new Position(isoX, isoY);
};

/**
 * Átalakaítja az isometrikus koordinátát, kartéziánus koordinátává
 * @param iso isometrikus koordináta
 * @returns kartéziánus koordináta
 */
export const isometricToCartesian = (iso: Position): Position => {
  const x = (iso.x / Math.cos(Math.PI / 6) + iso.y / Math.sin(Math.PI / 6)) / 2;
  const y = (iso.y / Math.sin(Math.PI / 6) - iso.x / Math.cos(Math.PI / 6)) / 2;
  return new Position(x, y);
};

/**
 * Kiszámolja a megadott indexekből a koordinátákat
 * @param indices cella index
 * @returns kiszámolt koordináta
 */
export const calculatePositionFromIndices = (indices: Indices): Position => {
  const { i, j } = indices;

  const normalPos: Position = new Position(i * 48 + 48, j * 48 + 48);

  const isometricPos: Position = new Position(
    normalPos.x - normalPos.y,
    (normalPos.x + normalPos.y) / 2
  );

  return isometricPos;
};

/**
 * Visszaadd egy véletlen számot a megadott intervalumból
 * @param min minimum érték
 * @param max maximum érték
 * @returns véletlen szám min és max között
 */
export const getRandomNumberFromInterval = (
  min: number,
  max: number
): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

/**
 * A kirajzoláshoz a megfelelő sorrendre hozza a tömböket
 * @param entityArray entitás tömb (Unit, Building)
 */
export const ySort = (entityArray: Entity[]): void => {
  entityArray.sort((a: Entity, b: Entity) => {
    const { x: ax, y: ay } = a.getPosition();
    const { x: bx, y: by } = b.getPosition();

    if (ax === bx) {
      return ay - by;
    } else if (ay === by) {
      return bx - ax;
    } else if (ax < bx && ay < by) {
      return -1;
    } else if (ax > bx && ay < by) {
      return -1;
    }

    return 0;
  });
};

/**
 * Kiszámolja a két koordináta közötti távolságot
 * @param from kezdeti koordináta
 * @param to cél koordináta
 * @returns két koordináta távolsága
 */
export const calculateDistance = (from: Position, to: Position): number => {
  const x = to.x - from.x;
  const y = to.y - from.y;
  const distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  return distance;
};

/**
 * Kitörli a megadott tömből az elemet
 * @param arr entitás tömb
 * @param element törölni kívánt elem
 */
export const removeElementFromArray = (arr: Entity[], element: Entity) => {
  for (let i = arr.length - 1; i >= 0; --i) {
    if (arr[i] == element) {
      arr.splice(i, 1);
    }
  }
};

/**
 * Visszaadd egy véleltlen elemet a tömbből
 * @param arr generikus tömb
 * @returns véletlen generikus elem a tömbből
 */
export const getRandomElementFromArray = <T>(arr: T[]): T => {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
};
