import { SubMenuState } from "@/enums/gameMenuState";
import { LabelButton } from "@/game/menu/sections/labelButton";
import { StateManager } from "@/manager/stateManager";
import { Button } from "@/page/components/button";
import { Frame } from "@/page/components/frame";
import { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";

export class Section {
  private section: Frame;
  protected subSections: Partial<Record<SubMenuState, Section>> = {};

  protected pos: Position;
  protected buttons: Button[] = [];
  protected labelbuttons: LabelButton[] = [];
  protected drawFrame: boolean = true;

  public constructor(pos: Position, dim: Dimension) {
    this.pos = pos;
    this.section = new Frame(pos, dim);
  }

  public draw(): void {
    if (this.drawFrame) {
      this.section.draw();
      this.subSections[StateManager.getSubMenuState()]?.draw();
    }

    this.buttons.forEach((btn) => btn.draw());
    this.labelbuttons.forEach((btn) => btn.draw());
  }

  public drawTooltips(): void {
    this.subSections[StateManager.getSubMenuState()]?.drawTooltips();
    this.labelbuttons.forEach((btn) => btn.drawTooltip());
  }

  public update(dt: number, mousePos: Position): void {
    this.section.update(dt, mousePos);
    this.subSections[StateManager.getSubMenuState()]?.update(dt, mousePos);

    this.buttons.forEach((btn) => btn.update(dt, mousePos));
    this.labelbuttons.forEach((btn) => btn.update(dt, mousePos));
  }

  public updateInfoPanel(): void {}

  public getButtons(): Button[] {
    return this.buttons;
  }

  public getLabelButton(): LabelButton[] {
    return this.labelbuttons;
  }

  public handleClick(mousePos: Position) {}
}
