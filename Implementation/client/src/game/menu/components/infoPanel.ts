import { state } from "../../../data/state";
import { ctx } from "../../../init";
import { Button } from "../../../page/components/buttonComponents/button";
import { ServerHandler } from "../../../server/serverHandler";
import { Dimension } from "../../../utils/dimension";
import { Position } from "../../../utils/position";
import { Section } from "./section";

export class InfoPanel extends Section {
  private dim: Dimension;
  private deleteButton: Button;

  public constructor(pos: Position, dim: Dimension) {
    super(pos, dim);
    this.dim = dim;

    this.deleteButton = new Button(
      new Position(pos.x + dim.width - 25, pos.y + 5),
      new Dimension(25, 25),
      "name",
      "empty"
    );
  }

  draw(): void {
    super.draw();
    ctx.save();
    ctx.fillText(
      state.info.name,
      this.pos.x -
        ctx.measureText(state.info.name).width / 2 +
        this.dim.width / 2,
      this.pos.y + 30
    );
    ctx.restore();

    this.deleteButton.draw();
  }

  update(dt: number, mousePos: Position): void {
    this.deleteButton.update(dt, mousePos);
  }

  public handleClick(mousePos: Position): void {
    if (this.deleteButton.isClicked(mousePos.x, mousePos.y)) {
      ServerHandler.sendMessage("game:destroy", state.info.data);
    }
  }
}
