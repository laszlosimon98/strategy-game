import { canvasHeight, canvasWidth } from "../../../init";
import { BUTTON_SIZE, MARGIN } from "../../../settings";
import { Point } from "../../../utils/point";

export const buttonPos = {
  mainMenu: {
    newGame: new Point(
      canvasWidth / 2 - BUTTON_SIZE.width / 2,
      canvasHeight / 2 - MARGIN
    ),
    description: new Point(
      canvasWidth / 2 - BUTTON_SIZE.width / 2,
      canvasHeight / 2
    ),
    statistic: new Point(
      canvasWidth / 2 - BUTTON_SIZE.width / 2,
      canvasHeight / 2 + MARGIN
    ),
    login: new Point(canvasWidth - BUTTON_SIZE.width - MARGIN, MARGIN / 2),
    registration: new Point(
      canvasWidth - BUTTON_SIZE.width - MARGIN,
      BUTTON_SIZE.height / 2 + MARGIN
    ),
    namePlate: new Point(MARGIN, MARGIN),
  },
  newGame: {
    back: new Point(
      canvasWidth / 2 - BUTTON_SIZE.width / 2,
      canvasHeight / 2 - BUTTON_SIZE.height / 2 + MARGIN * 2
    ),
    create: new Point(
      canvasWidth / 2 - BUTTON_SIZE.width / 2,
      canvasHeight / 2 - BUTTON_SIZE.height / 2 - MARGIN
    ),
    join: new Point(
      canvasWidth / 2 - BUTTON_SIZE.width / 2,
      canvasHeight / 2 - BUTTON_SIZE.height / 2
    ),
  },
  default: {
    back: new Point(
      canvasWidth / 2 - BUTTON_SIZE.width / 2 - MARGIN * 3,
      Math.max(canvasHeight - BUTTON_SIZE.height - MARGIN, 450)
    ),
    next: new Point(
      canvasWidth / 2 - BUTTON_SIZE.width / 2 + MARGIN * 3,
      Math.max(canvasHeight - BUTTON_SIZE.height - MARGIN, 450)
    ),
  },
};
