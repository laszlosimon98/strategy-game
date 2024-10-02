import { Vector } from "../../../utils/vector";
import { MainSection } from "./mainSection";

export class GameMenu {
  private mainSection: MainSection;

  constructor(pos: Vector, width: number, height: number) {
    this.mainSection = new MainSection(pos, width, 75);
  }

  draw(): void {
    this.mainSection.draw();
  }

  update(): void {
    this.mainSection.update();
  }

  resize(): void {}

  handleClick(): void {
    this.mainSection.handleClick();
  }
}
