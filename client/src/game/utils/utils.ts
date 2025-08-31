import { CELL_SIZE } from "@/game/settings";
import { Indices } from "@/game/utils/indices";
import { Position } from "@/game/utils/position";
import { Entity } from "@/game/world/entity";
import { Soldier } from "@/game/world/unit/units/soldier";
import { getCurrentState } from "@/services/store";
import { EntityType, PlayerIdType } from "@/services/types/game.types";

/**
 * Visszatér a url-ből kinyert kép névvel, a kiterjesztés nélkül
 * @param url url string
 * @returns url-ből kinyert kép névvel, a kiterjesztés nélkül
 */
export const getImageNameFromUrl = (url: string): string => {
  const split = url.split("/");
  const length = split.length;

  return split[length - 1].split(".")[0];
};

/**
 * Visszatér az  indexel, ahol a kurzor van
 * @param {Position} mouse mouse position
 * @param {Position} cameraScroll camera position
 * @returns indexel, ahol a kurzor van
 */
export const convertMouseIsometricCoordsToCartesianCoords = (
  mouse: Position,
  cameraScroll: Position
): Indices => {
  const world_x = mouse.x - cameraScroll.x;
  const world_y = mouse.y - cameraScroll.y;

  const cart_y = (2 * world_y - world_x) / 2;
  const cart_x = cart_y + world_x;

  const grid_x = Math.floor(cart_x / CELL_SIZE);
  const grid_y = Math.floor(cart_y / CELL_SIZE);

  return new Indices(grid_x, grid_y);
};

/**
 * Átalakítja az kartázián pozíciót isometrikus pozícióvá
 * @param {Position} cartesianPos kartézián pozíció
 * @returns Átalakítja az kartázián pozíciót isometrikus pozícióvá
 */
export const cartesianToIsometric = (cartesianPos: Position): Position => {
  const { x, y } = cartesianPos;
  const isoX = (x - y) * Math.cos(Math.PI / 6);
  const isoY = (x + y) * Math.sin(Math.PI / 6);
  return new Position(isoX, isoY);
};

/**
 * Átalakítja az isometrikus pozíciót kartézián pozícióvá
 * @param {Position} isometricPos isometrikus pozíció
 * @returns Átalakítja az isometrikus pozíciót kartézián pozícióvá
 */
export const isometricToCartesian = (isometricPos: Position): Position => {
  const x =
    (isometricPos.x / Math.cos(Math.PI / 6) +
      isometricPos.y / Math.sin(Math.PI / 6)) /
    2;
  const y =
    (isometricPos.y / Math.sin(Math.PI / 6) -
      isometricPos.x / Math.cos(Math.PI / 6)) /
    2;
  return new Position(x, y);
};

/**
 * Metszi e az kurzor az elemet
 * @param {Position} mousePos kurzor pozíció
 * @param {any} element elem a világban (épület, egység, ...),
 * @returns Metszi e az kurzor az elemet
 */
export const isMouseIntersect = (mousePos: Position, element: any): boolean => {
  const horizontal =
    mousePos.x >= element.getPosition().x &&
    mousePos.x <= element.getPosition().x + element.getDimension().width;
  const vertical =
    mousePos.y >= element.getPosition().y &&
    mousePos.y <= element.getPosition().y + element.getDimension().height;
  return horizontal && vertical;
};

/**
 * Generál egy random számot a minimum érték és a maximum érték között
 * @param min minimum érték
 * @param max maximum érték
 * @returns Generál egy random számot a minimum érték és a maximum érték között
 */
export const getRandomNumberFromInterval = (
  min: number,
  max: number
): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

/**
 * Rendezi a tömböt az isometrikus világ szerint
 * @param {Entity[]} entityArray rendezésre váró entity tömb
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
 * Kiszámolja a távolságot a két pozíció között
 * @param {Position} from tól
 * @param {Position} to ig
 * @returns Kiszámolja a távolságot a két pozíció között
 */
export const calculateDistance = (from: Position, to: Position): number => {
  const x = to.x - from.x;
  const y = to.y - from.y;
  const distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  return distance;
};

/**
 * Megkeresi az egységet a tömbben
 * @param _unit egység
 * @returns Megkeresi az egységet a tömben
 */
export const findUnit = (_unit: EntityType): Soldier | undefined => {
  const { owner, id } = _unit.data;
  const players: PlayerIdType = getCurrentState(
    (state) => state.game.data.players
  );

  return players[owner].units.find(
    (unit: Soldier) => unit.getEntity().data.id === id
  );
};
