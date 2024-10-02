import { canvasHeight, canvasWidth } from "../../../init";
import { TITLE_SIZE } from "../../../settings";
import { Vector } from "../../../utils/vector";

export const titlePos = new Vector(
  canvasWidth / 2 - TITLE_SIZE.width / 2,
  canvasHeight / 15
);
