import { canvasHeight, canvasWidth } from "../../../init";
import { MARGIN } from "../../../settings";
import { Vector } from "../../../utils/vector";

export const inputPos = {
  auth: {
    name: new Vector(canvasWidth / 2 - 300, canvasHeight / 2 - MARGIN),
    password: new Vector(canvasWidth / 2 - 300, canvasHeight / 2 + MARGIN),
  },
  code: new Vector(canvasWidth / 2 - 375, canvasHeight / 2 - 20),
};
