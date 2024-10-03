import { canvasHeight, canvasWidth } from "../../../init";
import { MARGIN } from "../../../settings";
import { Vector } from "../../../utils/vector";

export const inputPos = {
  auth: {
    name: new Vector(canvasWidth / 2 - 250, canvasHeight / 2 - MARGIN),
    password: new Vector(canvasWidth / 2 - 250, canvasHeight / 2 + 25),
  },
  code: new Vector(canvasWidth / 2 - 500 / 2, canvasHeight / 2 - 20),
};
