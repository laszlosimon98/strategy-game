import { canvasHeight, canvasWidth } from "../../../init";
import { TITLE_SIZE } from "../../../settings";
import { Point } from "../../../utils/point";

export const titlePos = new Point(
  canvasWidth / 2 - TITLE_SIZE.width / 2,
  canvasHeight / 15
);
