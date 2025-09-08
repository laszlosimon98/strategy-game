import { state } from "@/data/state";
import { Entity } from "@/game/world/entity";
import { Soldier } from "@/game/world/unit/units/soldier";
import { settings } from "@/settings";
import type { EntityType } from "@/types/game.types";
import { Indices } from "@/utils/indices";
import { Position } from "@/utils/position";

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

  const grid_x = Math.floor(cart_x / settings.size.cell);
  const grid_y = Math.floor(cart_y / settings.size.cell);

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

export const cartesianToIsometric = (pos: Position): Position => {
  const { x, y } = pos;
  const isoX = (x - y) * Math.cos(Math.PI / 6);
  const isoY = (x + y) * Math.sin(Math.PI / 6);
  return new Position(isoX, isoY);
};

export const isometricToCartesian = (iso: Position): Position => {
  const x = (iso.x / Math.cos(Math.PI / 6) + iso.y / Math.sin(Math.PI / 6)) / 2;
  const y = (iso.y / Math.sin(Math.PI / 6) - iso.x / Math.cos(Math.PI / 6)) / 2;
  return new Position(x, y);
};

export const calculateDistance = (from: Position, to: Position): number => {
  const x = to.x - from.x;
  const y = to.y - from.y;
  const distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  return distance;
};

export const findUnit = (entity: EntityType): Soldier => {
  const { owner, id } = entity.data;
  return state.game.players[owner].units.find(
    (unit) => unit.getEntity().data.id === id
  ) as Soldier;
};

export const removeElementFromArray = (arr: Entity[], element: Entity) => {
  for (let i = arr.length - 1; i >= 0; --i) {
    if (arr[i] == element) {
      arr.splice(i, 1);
    }
  }
};
