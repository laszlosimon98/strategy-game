import { canvasWidth, canvasHeight } from "@/init";
import { settings } from "@/settings";
import { Position } from "@/utils/position";

export const inputPos = {
  auth: {
    name: new Position(
      canvasWidth / 2 - 250,
      canvasHeight / 2 - settings.margin
    ),
    password: new Position(canvasWidth / 2 - 250, canvasHeight / 2 + 25),
  },
  code: new Position(canvasWidth / 2 - 500 / 2, canvasHeight / 2 + 20),
};
