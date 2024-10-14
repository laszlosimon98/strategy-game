import { globalState } from "../../../data/data";
import { Button } from "../../../page/components/buttonComponents/button";
import { Frame } from "../../../page/components/frameComponets/frame";
import { GameSubMenuState } from "../../../states/gameMenuState";
import { Position } from "../../../utils/position";
import { LabelButton } from "./labelButton";

export class Section {
  private section: Frame;
  protected subSections: Partial<Record<GameSubMenuState, Section>> = {};

  protected buttons: Button[] = [];
  protected labelbuttons: LabelButton[] = [];
  // protected items: Item[];
  // protected units: Unit[];

  public constructor(pos: Position, width: number, height: number) {
    this.section = new Frame(pos, width, height);
  }

  public draw(): void {
    this.section.draw();
    this.subSections[globalState.subMenuState]?.draw();

    this.buttons.forEach((btn) => btn.draw());
    this.labelbuttons.forEach((btn) => btn.draw());
    // this.items.forEach(item => item.draw());
    // this.units.forEach(unit => unit.draw());
  }

  public update(mousePos: Position): void {
    this.section.update(mousePos);
    this.subSections[globalState.subMenuState]?.update(mousePos);

    this.buttons.forEach((btn) => btn.update(mousePos));
    this.labelbuttons.forEach((btn) => btn.update(mousePos));
    // this.items.forEach(item => item.update());
    // this.units.forEach(unit => unit.update());
  }

  public getButtons(): Button[] {
    return this.buttons;
  }

  public getLabelButton(): LabelButton[] {
    return this.labelbuttons;
  }

  public handleClick(mousePos: Position) {
    console.log("asdf");
  }
}
