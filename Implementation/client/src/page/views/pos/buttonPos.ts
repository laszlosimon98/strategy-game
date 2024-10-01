import { canvasHeight, canvasWidth } from "../../../init";
import { BUTTON_SIZE, MARGIN } from "../../../settings";

export const buttonPos = {
  mainMenu: {
    newGame: {
      x: canvasWidth / 2 - BUTTON_SIZE.width / 2,
      y: canvasHeight / 2 - MARGIN,
    },
    description: {
      x: canvasWidth / 2 - BUTTON_SIZE.width / 2,
      y: canvasHeight / 2,
    },
    statistic: {
      x: canvasWidth / 2 - BUTTON_SIZE.width / 2,
      y: canvasHeight / 2 + MARGIN,
    },
    login: {
      x: canvasWidth - BUTTON_SIZE.width - MARGIN,
      y: MARGIN / 2,
    },
    registration: {
      x: canvasWidth - BUTTON_SIZE.width - MARGIN,
      y: BUTTON_SIZE.height / 2 + MARGIN,
    },
    namePlate: {
      x: MARGIN,
      y: MARGIN,
    },
  },
  statistic: {
    back: {
      x: MARGIN * 2,
      y: canvasHeight - BUTTON_SIZE.height - MARGIN,
    },
  },
  description: {
    back: {
      x: MARGIN * 2,
      y: canvasHeight - BUTTON_SIZE.height - MARGIN,
    },
  },
  newGame: {
    back: {
      x: canvasWidth / 2 - BUTTON_SIZE.width / 2,
      y: canvasHeight / 2 - BUTTON_SIZE.height / 2 + MARGIN * 2,
    },
    create: {
      x: canvasWidth / 2 - BUTTON_SIZE.width / 2,
      y: canvasHeight / 2 - BUTTON_SIZE.height / 2 - MARGIN,
    },
    join: {
      x: canvasWidth / 2 - BUTTON_SIZE.width / 2,
      y: canvasHeight / 2 - BUTTON_SIZE.height / 2,
    },
  },
  default: {
    back: {
      x: canvasWidth / 2 - BUTTON_SIZE.width / 2 - MARGIN * 3,
      y: canvasHeight - BUTTON_SIZE.height - MARGIN,
    },
    next: {
      x: canvasWidth / 2 - BUTTON_SIZE.width / 2 + MARGIN * 3,
      y: canvasHeight - BUTTON_SIZE.height - MARGIN,
    },
  },
};
