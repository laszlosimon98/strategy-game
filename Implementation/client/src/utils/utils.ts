import { Entity } from "../game/world/entity";
import { CELL_SIZE } from "../settings";
import { Indices } from "./indices";
import { Position } from "./position";

export const getImageNameFromUrl = (url: string): string => {
  const split = url.split("/");
  const length = split.length;

  return split[length - 1].split(".")[0];
};

export const convertIsometricCoordsToCartesianCoords = (
  position: Position,
  cameraScroll: Position
): Indices => {
  const world_x = position.x - cameraScroll.x;
  const world_y = position.y - cameraScroll.y;

  const cart_y = (2 * world_y - world_x) / 2;
  const cart_x = cart_y + world_x;

  const grid_x = Math.floor(cart_x / CELL_SIZE);
  const grid_y = Math.floor(cart_y / CELL_SIZE);

  return new Indices(grid_x, grid_y);
};

export const isMouseIntersect = (mousePos: Position, element: any): boolean => {
  const horizontal =
    mousePos.x >= element.getPosition().x &&
    mousePos.x <= element.getPosition().x + element.getDimension().width;
  const vertical =
    mousePos.y >= element.getPosition().y &&
    mousePos.y <= element.getPosition().y + element.getDimension().height;
  return horizontal && vertical;
};

export const getRandomNumberFromInterval = (
  min: number,
  max: number
): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const calculateDistance = (from: Position, to: Position): number => {
  const x = to.x - from.x;
  const y = to.y - from.y;
  const distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  return distance;
};

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
