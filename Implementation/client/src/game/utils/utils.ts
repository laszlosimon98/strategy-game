import { TILE_SIZE } from "../../settings";
import { Indices } from "../../utils/indices";
import { Position } from "../../utils/position";

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
