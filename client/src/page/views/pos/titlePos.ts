import { canvasWidth, canvasHeight } from "@/init";
import { settings } from "@/settings";
import { Position } from "@/utils/position";

export const titlePos = new Position(
  canvasWidth / 2 - settings.size.title.width / 2,
  canvasHeight / 15
);
