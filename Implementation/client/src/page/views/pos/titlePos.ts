import { canvasHeight, canvasWidth } from "../../../init";
import { TITLE_SIZE } from "../../../settings";
import { Position } from "../../../utils/position";

export const titlePos = new Position(
  canvasWidth / 2 - TITLE_SIZE.width / 2,
  canvasHeight / 15
);
