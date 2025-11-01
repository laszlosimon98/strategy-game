import { Position } from "@/utils/position";
import { Indices } from "@/utils/indices";

export const calculateDistance = (from: Position, to: Position): number => {
  const x = to.x - from.x;
  const y = to.y - from.y;
  const distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  return distance;
};

export const calculateDistanceByIndices = (
  from: Indices,
  to: Indices
): number => {
  const i = to.i - from.i;
  const j = to.j - from.j;
  const distance = Math.sqrt(Math.pow(i, 2) + Math.pow(j, 2));
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

export const getRandomElementFromArray = <T>(arr: T[]): T => {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
};
