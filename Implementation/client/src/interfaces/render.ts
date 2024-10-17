import { Position } from "../utils/position";

export interface RenderInterface {
  draw(): void;
  update(dt: number, mousePos?: Position): void;
}
