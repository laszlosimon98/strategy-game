import { Socket } from "socket.io";

import { Communicate } from "@/classes/communicate";
import { Unit } from "@/classes/game/unit";
import { state } from "@/data/state";
import { EntityType, Position } from "@/types/types";

export const getUnit = (
  socket: Socket,
  entity: EntityType
): Unit | undefined => {
  const unit: Unit | undefined = state[
    Communicate.getCurrentRoom(socket)
  ].players[entity.data.owner].units.find(
    (unit) => unit.getEntity().data.id === entity.data.id
  );

  return unit;
};

export const calculateDistance = (from: Position, to: Position): number => {
  const x = to.x - from.x;
  const y = to.y - from.y;
  const distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  return distance;
};

export const getRandomNumberFromInterval = (
  min: number,
  max: number
): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const getImageNameFromUrl = (url: string): string => {
  const split = url.split("/");
  const length = split.length;

  return split[length - 1].split(".")[0];
};
