import { canvasWidth, canvasHeight } from "@/init";
import { BUTTON_SIZE, MARGIN } from "@/settings";
import { Position } from "@/utils/position";

export const buttonPos = {
  mainMenu: {
    newGame: new Position(
      canvasWidth / 2 - BUTTON_SIZE.width / 2,
      canvasHeight / 2 - MARGIN
    ),
    description: new Position(
      canvasWidth / 2 - BUTTON_SIZE.width / 2,
      canvasHeight / 2
    ),
    statistic: new Position(
      canvasWidth / 2 - BUTTON_SIZE.width / 2,
      canvasHeight / 2 + MARGIN
    ),
    login: new Position(canvasWidth - BUTTON_SIZE.width - MARGIN, MARGIN / 2),
    registration: new Position(
      canvasWidth - BUTTON_SIZE.width - MARGIN,
      BUTTON_SIZE.height / 2 + MARGIN
    ),
    namePlate: new Position(MARGIN, MARGIN),
  },
  newGame: {
    back: new Position(
      canvasWidth / 2 - BUTTON_SIZE.width / 2,
      canvasHeight / 2 - BUTTON_SIZE.height / 2 + MARGIN * 2
    ),
    create: new Position(
      canvasWidth / 2 - BUTTON_SIZE.width / 2,
      canvasHeight / 2 - BUTTON_SIZE.height / 2 - MARGIN
    ),
    join: new Position(
      canvasWidth / 2 - BUTTON_SIZE.width / 2,
      canvasHeight / 2 - BUTTON_SIZE.height / 2
    ),
  },
  default: {
    back: new Position(
      canvasWidth / 2 - BUTTON_SIZE.width / 2 - MARGIN * 3,
      Math.max(canvasHeight - BUTTON_SIZE.height - MARGIN, 450)
    ),
    next: new Position(
      canvasWidth / 2 - BUTTON_SIZE.width / 2 + MARGIN * 3,
      Math.max(canvasHeight - BUTTON_SIZE.height - MARGIN, 450)
    ),
  },
};
