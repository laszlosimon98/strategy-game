import { canvasWidth, canvasHeight } from "@/init";
import { settings } from "@/settings";
import { Position } from "@/utils/position";

export const buttonPos = {
  mainMenu: {
    newGame: new Position(
      canvasWidth / 2 - settings.size.button.width / 2,
      canvasHeight / 2 - settings.margin
    ),
    description: new Position(
      canvasWidth / 2 - settings.size.button.width / 2,
      canvasHeight / 2
    ),
    statistic: new Position(
      canvasWidth / 2 - settings.size.button.width / 2,
      canvasHeight / 2 + settings.margin
    ),
    login: new Position(
      canvasWidth - settings.size.button.width - settings.margin,
      settings.margin / 2
    ),
    registration: new Position(
      canvasWidth - settings.size.button.width - settings.margin,
      settings.size.button.height / 2 + settings.margin
    ),
    namePlate: new Position(settings.margin, settings.margin),
  },
  newGame: {
    back: new Position(
      canvasWidth / 2 - settings.size.button.width / 2,
      canvasHeight / 2 - settings.size.button.height / 2 + settings.margin * 2
    ),
    create: new Position(
      canvasWidth / 2 - settings.size.button.width / 2,
      canvasHeight / 2 - settings.size.button.height / 2 - settings.margin
    ),
    join: new Position(
      canvasWidth / 2 - settings.size.button.width / 2,
      canvasHeight / 2 - settings.size.button.height / 2
    ),
  },
  default: {
    back: new Position(
      canvasWidth / 2 - settings.size.button.width / 2 - settings.margin * 3,
      Math.max(
        canvasHeight - settings.size.button.height - settings.margin,
        450
      )
    ),
    next: new Position(
      canvasWidth / 2 - settings.size.button.width / 2 + settings.margin * 3,
      Math.max(
        canvasHeight - settings.size.button.height - settings.margin,
        450
      )
    ),
  },
};
