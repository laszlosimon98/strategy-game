import { state } from "../../../data/state";
import { MainMenuState } from "../../../enums/gameMenuState";
import { ctx } from "../../../init";
import { Button } from "../../../page/components/buttonComponents/button";
import { ServerHandler } from "../../../server/serverHandler";
import { ITEM_SIZE } from "../../../settings";
import { Dimension } from "../../../utils/dimension";
import { Position } from "../../../utils/position";
import { Section } from "./section";

export class InfoPanel extends Section {
  private dim: Dimension;
  private deleteButton: Button;
  private image: HTMLImageElement;

  public constructor(pos: Position, dim: Dimension) {
    super(pos, dim);
    this.dim = dim;

    this.deleteButton = new Button(
      new Position(pos.x + dim.width - 30, pos.y + 55),
      new Dimension(25, 25),
      "name",
      "empty"
    );

    this.image = new Image(ITEM_SIZE * 1.5, ITEM_SIZE * 1.5);
  }

  draw(): void {
    super.draw();
    if (state.infoPanel.data) {
      ctx.fillText(
        state.infoPanel.data.getName(),
        this.pos.x -
          ctx.measureText(state.infoPanel.data.getName()).width / 2 +
          this.dim.width / 2,
        this.pos.y + 75
      );
    }

    ctx.drawImage(
      this.image,
      this.pos.x + this.dim.width / 2 - this.image.width / 2,
      this.pos.y + this.dim.height / 2 - this.image.height / 2 - 10,
      this.image.width,
      this.image.height
    );

    this.deleteButton.draw();
  }

  update(dt: number, mousePos: Position): void {
    this.deleteButton.update(dt, mousePos);

    if (
      state.infoPanel.data &&
      ((state.infoPanel.data.getEntity().data.url.length &&
        !this.image.src.length) ||
        state.infoPanel.data?.getEntity().data.url !== this.image.src)
    ) {
      this.image.src = state.infoPanel.data.getEntity().data.url;
    }
  }

  public handleClick(mousePos: Position): void {
    if (this.deleteButton.isClicked(mousePos.x, mousePos.y)) {
      state.navigation.gameMenuState = state.navigation.prevMenuState;
      ServerHandler.sendMessage(
        "game:destroy",
        state.infoPanel.data?.getIndices()
      );
    }
  }
}
