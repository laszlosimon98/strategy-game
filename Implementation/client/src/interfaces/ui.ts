import { Position } from "../utils/position";

export interface UI {
  draw(): void;
  update(mousePos: Position): void;
}

export interface BuildingAction {
  action: () => void;
}
