import { canvasWidth, canvasHeight } from "@/init";
import { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";

const MARGIN: number = 75;
const BUTTON_DIMENSION: Dimension = new Dimension(192, 60);
const TITLE_DIMENSION: Dimension = new Dimension(288, 90);
const MENUITEM_DIMENSION: Dimension = new Dimension(64, 64);
const UNIT_DIMENSION: Dimension = new Dimension(64, 64);
const HOUSEITEM_DIMENSION: Dimension = new Dimension(96, 96);
const TOOLTIP_DIMENDION: Dimension = new Dimension(120, 100);
const MESSAGE_INDICATOR: Dimension = new Dimension(500, 50);
const CHAT_INPUT: Dimension = new Dimension(650, 50);
const CHAT_FRAME: Dimension = new Dimension(300, 200);
const CELL_SIZE: number = 48;

export const settings = {
  chatTextLength: 30,
  fps: 60,
  margin: MARGIN,
  size: {
    button: BUTTON_DIMENSION,
    title: TITLE_DIMENSION,
    menuItem: MENUITEM_DIMENSION,
    unit: UNIT_DIMENSION,
    houseItem: HOUSEITEM_DIMENSION,
    tooltip: TOOLTIP_DIMENDION,
    messageIndicator: MESSAGE_INDICATOR,
    chatInput: CHAT_INPUT,
    chatFrame: CHAT_FRAME,
    unitAsset: 64,
    item: 96,
    cell: CELL_SIZE,
  },
  color: {
    background: "#F1C585",
    text: "#EFBF04",
    black: "#000",
    error: "#b80606",
    info: "#1f6e02",
    brown: "#90460C",
    lightBrown: "#B85A0F",
  },
  offset: {
    menuMargin: 7.5,
    item: 19,
    menuItem: 75,
  },
  speed: {
    camera: 800,
    unit: 80,
  },
  animation: {
    count: 8,
    speed: 8,
  },
  gameMenu: {
    pos: new Position(20, 80),
    dim: new Dimension(250, 500),
  },
  pos: {
    mainMenu: {
      newGame: new Position(
        canvasWidth / 2 - BUTTON_DIMENSION.width / 2,
        canvasHeight / 2 - MARGIN
      ),
      description: new Position(
        canvasWidth / 2 - BUTTON_DIMENSION.width / 2,
        canvasHeight / 2
      ),
      statistic: new Position(
        canvasWidth / 2 - BUTTON_DIMENSION.width / 2,
        canvasHeight / 2 + MARGIN
      ),
      login: new Position(
        canvasWidth - BUTTON_DIMENSION.width - MARGIN,
        MARGIN / 2
      ),
      registration: new Position(
        canvasWidth - BUTTON_DIMENSION.width - MARGIN,
        BUTTON_DIMENSION.height / 2 + MARGIN
      ),
      namePlate: new Position(MARGIN, MARGIN),
    },
    newGame: {
      back: new Position(
        canvasWidth / 2 - BUTTON_DIMENSION.width / 2,
        canvasHeight / 2 - BUTTON_DIMENSION.height / 2 + MARGIN * 2
      ),
      create: new Position(
        canvasWidth / 2 - BUTTON_DIMENSION.width / 2,
        canvasHeight / 2 - BUTTON_DIMENSION.height / 2 - MARGIN
      ),
      join: new Position(
        canvasWidth / 2 - BUTTON_DIMENSION.width / 2,
        canvasHeight / 2 - BUTTON_DIMENSION.height / 2
      ),
    },
    default: {
      back: new Position(
        canvasWidth / 2 - BUTTON_DIMENSION.width / 2 - MARGIN * 3,
        Math.max(canvasHeight - BUTTON_DIMENSION.height - MARGIN, 450)
      ),
      next: new Position(
        canvasWidth / 2 - BUTTON_DIMENSION.width / 2 + MARGIN * 3,
        Math.max(canvasHeight - BUTTON_DIMENSION.height - MARGIN, 450)
      ),
    },
    auth: {
      name: new Position(canvasWidth / 2 - 250, canvasHeight / 2 - MARGIN),
      password: new Position(canvasWidth / 2 - 250, canvasHeight / 2 + 25),
    },
    code: new Position(canvasWidth / 2 - 500 / 2, canvasHeight / 2 - 20),
    titlePos: new Position(
      canvasWidth / 2 - TITLE_DIMENSION.width / 2,
      canvasHeight / 15
    ),
  },
  timer: {
    visibilityInMs: 3000,
  },
};
