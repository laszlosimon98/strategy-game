import { SubMenuState } from "@/enums/gameMenuState";
import { LabelButton } from "@/game/menu/components/labelButton";
import { GameStateManager } from "@/gameStateManager/gameStateManager";
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

  public constructor(pos: Position, dim: Dimension) {
    this.pos = pos;
    this.section = new Frame(pos, dim);
  }

  public draw(): void {
    this.section.draw();
    this.subSections[GameStateManager.getSubMenuState()]?.draw();

    this.buttons.forEach((btn) => btn.draw());
    this.labelbuttons.forEach((btn) => btn.draw());
  }

  public update(dt: number, mousePos: Position): void {
    this.section.update(dt, mousePos);
    this.subSections[GameStateManager.getSubMenuState()]?.update(dt, mousePos);

    this.buttons.forEach((btn) => btn.update(dt, mousePos));
    this.labelbuttons.forEach((btn) => btn.update(dt, mousePos));
  }

  public getButtons(): Button[] {
    return this.buttons;
  }

  public getLabelButton(): LabelButton[] {
    return this.labelbuttons;
  }

  public handleClick(mousePos: Position) {}
}
