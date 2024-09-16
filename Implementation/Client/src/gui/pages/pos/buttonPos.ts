import { canvasHeight, canvasWidth } from "../../../init";
import { buttonMargin, buttonSize } from "../../../settings";

export const buttonPos = {
  mainMenu: {
    newGame: {
      x: canvasWidth / 2 - buttonSize.width / 2,
      y: canvasHeight / 2 - buttonMargin,
    },
    description: {
      x: canvasWidth / 2 - buttonSize.width / 2,
      y: canvasHeight / 2,
    },
    statistic: {
      x: canvasWidth / 2 - buttonSize.width / 2,
      y: canvasHeight / 2 + buttonMargin,
    },
    login: {
      x: canvasWidth - buttonSize.width - buttonMargin,
      y: buttonMargin / 2,
    },
    registration: {
      x: canvasWidth - buttonSize.width - buttonMargin,
      y: buttonSize.height / 2 + buttonMargin,
    },
    namePlate: {
      x: buttonMargin,
      y: buttonMargin,
    },
  },
  statistic: {
    back: {
      x: buttonMargin * 2,
      y: canvasHeight - buttonSize.height - buttonMargin,
    },
  },
  description: {
    back: {
      x: buttonMargin * 2,
      y: canvasHeight - buttonSize.height - buttonMargin,
    },
  },
  newGame: {
    back: {
      x: canvasWidth / 2 - buttonSize.width / 2,
      y: canvasHeight / 2 - buttonSize.height / 2 + buttonMargin * 2,
    },
    create: {
      x: canvasWidth / 2 - buttonSize.width / 2,
      y: canvasHeight / 2 - buttonSize.height / 2 - buttonMargin,
    },
    join: {
      x: canvasWidth / 2 - buttonSize.width / 2,
      y: canvasHeight / 2 - buttonSize.height / 2,
    },
  },
  default: {
    back: {
      x: canvasWidth / 2 - buttonSize.width / 2 - buttonMargin * 3,
      y: canvasHeight - buttonSize.height - buttonMargin,
    },
    next: {
      x: canvasWidth / 2 - buttonSize.width / 2 + buttonMargin * 3,
      y: canvasHeight - buttonSize.height - buttonMargin,
    },
  },
};
