import { TILE_SIZE } from "../settings";
import { Indices } from "./indices";
import { Position } from "./position";

export const getImageNameFromUrl = (url: string): string => {
  return url.split("/")[6].split(".")[0];
};

export const convertIsometricCoordsToCartesianCoords = (
  position: Position,
  cameraScroll: Position
): Indices => {
  const world_x = position.x - cameraScroll.x;
  const world_y = position.y - cameraScroll.y;

  const cart_y = (2 * world_y - world_x) / 2;
  const cart_x = cart_y + world_x;

  const grid_x = Math.floor(cart_x / TILE_SIZE);
  const grid_y = Math.floor(cart_y / TILE_SIZE);

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
