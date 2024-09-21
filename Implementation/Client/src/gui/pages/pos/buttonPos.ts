import { canvasHeight, canvasWidth } from "../../../init";
import { buttonSize, margin } from "../../../settings";

export const buttonPos = {
  mainMenu: {
    newGame: {
      x: canvasWidth / 2 - buttonSize.width / 2,
      y: canvasHeight / 2 - margin,
    },
    description: {
      x: canvasWidth / 2 - buttonSize.width / 2,
      y: canvasHeight / 2,
    },
    statistic: {
      x: canvasWidth / 2 - buttonSize.width / 2,
      y: canvasHeight / 2 + margin,
    },
    login: {
      x: canvasWidth - buttonSize.width - margin,
      y: margin / 2,
    },
    registration: {
      x: canvasWidth - buttonSize.width - margin,
      y: buttonSize.height / 2 + margin,
    },
    namePlate: {
      x: margin,
      y: margin,
    },
  },
  statistic: {
    back: {
      x: margin * 2,
      y: canvasHeight - buttonSize.height - margin,
    },
  },
  description: {
    back: {
      x: margin * 2,
      y: canvasHeight - buttonSize.height - margin,
    },
  },
  newGame: {
    back: {
      x: canvasWidth / 2 - buttonSize.width / 2,
      y: canvasHeight / 2 - buttonSize.height / 2 + margin * 2,
    },
    create: {
      x: canvasWidth / 2 - buttonSize.width / 2,
      y: canvasHeight / 2 - buttonSize.height / 2 - margin,
    },
    join: {
      x: canvasWidth / 2 - buttonSize.width / 2,
      y: canvasHeight / 2 - buttonSize.height / 2,
    },
  },
  default: {
    back: {
      x: canvasWidth / 2 - buttonSize.width / 2 - margin * 3,
      y: canvasHeight - buttonSize.height - margin,
    },
    next: {
      x: canvasWidth / 2 - buttonSize.width / 2 + margin * 3,
      y: canvasHeight - buttonSize.height - margin,
    },
  },
};
