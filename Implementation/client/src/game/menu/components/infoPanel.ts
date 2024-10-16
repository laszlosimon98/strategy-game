import { infoPanel } from "../../../data/data";
import { images } from "../../../data/images";
import { ctx } from "../../../init";
import { Button } from "../../../page/components/buttonComponents/button";
import { ServerHandler } from "../../../server/serverHandler";
import { Position } from "../../../utils/position";
import { Section } from "./section";

export class InfoPanel extends Section {
  private width: number;
  private height: number;

  private deleteButton: Button;

  public constructor(pos: Position, width: number, height: number) {
    super(pos, width, height);
    this.width = width;
    this.height = height;

    this.deleteButton = new Button(
      new Position(pos.x + width - 25, pos.y + 5),
      25,
      25,
      images.page.buttons.empty.url
    );
  }

  draw(): void {
    super.draw();
    ctx.save();
    ctx.fillText(
      infoPanel.name,
      this.pos.x - ctx.measureText(infoPanel.name).width / 2 + this.width / 2,
      this.pos.y + 30
    );
    ctx.restore();

    this.deleteButton.draw();
  }

  update(mousePos: Position): void {
    this.deleteButton.update(mousePos);
  }

  public handleClick(mousePos: Position): void {
    if (this.deleteButton.isClicked(mousePos.x, mousePos.y)) {
      ServerHandler.sendMessage("game:destroy", infoPanel.data);
    }
  }
}
