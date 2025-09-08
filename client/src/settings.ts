import { Dimension } from "@/utils/dimension";

export const settings = {
  fps: 60,
  margin: 75,
  size: {
    button: new Dimension(192, 60),
    title: new Dimension(288, 90),
    menuItem: new Dimension(64, 64),
    unit: new Dimension(64, 64),
    unitAsset: 64,
    item: 96,
    houseItem: new Dimension(96, 96),
    cell: 48,
  },
  color: {
    background: "#F1C585",
    text: "#F1C585",
    black: "#000",
    error: "#b80606",
    info: "#1f6e02",
    inputBackground: "#90460C",
  },
  offset: {
    item: 19,
  },
  speed: {
    camera: 800,
    unit: 80,
  },
  animation: {
    count: 8,
    speed: 8,
  },
};
