import { canvasHeight, canvasWidth } from "../../../init";
import { MARGIN } from "../../../settings";

export const inputPos = {
  auth: {
    name: {
      x: canvasWidth / 2 - 300,
      y: canvasHeight / 2 - MARGIN,
    },
    password: {
      x: canvasWidth / 2 - 300,
      y: canvasHeight / 2 + MARGIN,
    },
  },
  code: {
    x: canvasWidth / 2 - 375,
    y: canvasHeight / 2 - 20,
  },
};
