import { globalState } from "../../../../data/data";
import { Button } from "../../../../page/components/buttonComponents/button";
import { Frame } from "../../../../page/components/frameComponets/frame";
import { GameSubMenuState } from "../../../../states/gameMenuState";
import { Point } from "../../../../utils/point";

export class Section {
  private section: Frame;
  protected subSections: Partial<Record<GameSubMenuState, Section>> = {};

  protected buttons: Button[] = [];
  // protected items: Item[];
  // protected units: Unit[];

  constructor(pos: Point, width: number, height: number) {
    this.section = new Frame(pos, width, height);
  }

  draw(): void {
    this.section.draw();
    this.subSections[globalState.subMenuState]?.draw();

    this.buttons.forEach((btn) => btn.draw());
    // this.items.forEach(item => item.draw());
    // this.units.forEach(unit => unit.draw());
  }

  update(mousePos: Point): void {
    this.section.update(mousePos);
    this.subSections[globalState.subMenuState]?.update(mousePos);

    this.buttons.forEach((btn) => btn.update(mousePos));
    // this.items.forEach(item => item.update());
    // this.units.forEach(unit => unit.update());
  }

  getButtons(): Button[] {
    return this.buttons;
  }
}
