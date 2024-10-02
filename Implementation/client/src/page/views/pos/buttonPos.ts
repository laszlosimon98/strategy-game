import { canvasHeight, canvasWidth } from "../../../init";
import { BUTTON_SIZE, MARGIN } from "../../../settings";
import { Vector } from "../../../utils/vector";

export const buttonPos = {
  mainMenu: {
    newGame: new Vector(
      canvasWidth / 2 - BUTTON_SIZE.width / 2,
      canvasHeight / 2 - MARGIN
    ),
    description: new Vector(
      canvasWidth / 2 - BUTTON_SIZE.width / 2,
      canvasHeight / 2
    ),
    statistic: new Vector(
      canvasWidth / 2 - BUTTON_SIZE.width / 2,
      canvasHeight / 2 + MARGIN
    ),
    login: new Vector(canvasWidth - BUTTON_SIZE.width - MARGIN, MARGIN / 2),
    registration: new Vector(
      canvasWidth - BUTTON_SIZE.width - MARGIN,
      BUTTON_SIZE.height / 2 + MARGIN
    ),
    namePlate: new Vector(MARGIN, MARGIN),
  },
  statistic: new Vector(MARGIN * 2, canvasHeight - BUTTON_SIZE.height - MARGIN),
  description: new Vector(
    MARGIN * 2,
    canvasHeight - BUTTON_SIZE.height - MARGIN
  ),
  newGame: {
    back: new Vector(
      canvasWidth / 2 - BUTTON_SIZE.width / 2,
      canvasHeight / 2 - BUTTON_SIZE.height / 2 + MARGIN * 2
    ),
    create: new Vector(
      canvasWidth / 2 - BUTTON_SIZE.width / 2,
      canvasHeight / 2 - BUTTON_SIZE.height / 2 - MARGIN
    ),
    join: new Vector(
      canvasWidth / 2 - BUTTON_SIZE.width / 2,
      canvasHeight / 2 - BUTTON_SIZE.height / 2
    ),
  },
  default: {
    back: new Vector(
      canvasWidth / 2 - BUTTON_SIZE.width / 2 - MARGIN * 3,
      canvasHeight - BUTTON_SIZE.height - MARGIN
    ),
    next: new Vector(
      canvasWidth / 2 - BUTTON_SIZE.width / 2 + MARGIN * 3,
      canvasHeight - BUTTON_SIZE.height - MARGIN
    ),
  },
};
