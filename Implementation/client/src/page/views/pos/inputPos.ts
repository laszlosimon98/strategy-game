import { canvasHeight, canvasWidth } from "../../../init";
import { MARGIN } from "../../../settings";
import { Point } from "../../../utils/point";

export const inputPos = {
  auth: {
    name: new Point(canvasWidth / 2 - 250, canvasHeight / 2 - MARGIN),
    password: new Point(canvasWidth / 2 - 250, canvasHeight / 2 + 25),
  },
  code: new Point(canvasWidth / 2 - 500 / 2, canvasHeight / 2 - 20),
};
