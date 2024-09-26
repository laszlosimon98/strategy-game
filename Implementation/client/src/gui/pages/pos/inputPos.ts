import { canvasHeight, canvasWidth } from "../../../init";
import { margin } from "../../../settings";

export const inputPos = {
  auth: {
    name: {
      x: canvasWidth / 2 - 300,
      y: canvasHeight / 2 - margin,
    },
    password: {
      x: canvasWidth / 2 - 300,
      y: canvasHeight / 2 + margin,
    },
  },
  code: {
    x: canvasWidth / 2 - 375,
    y: canvasHeight / 2 - 20,
  },
};
