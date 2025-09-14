import { Section } from "@/game/menu/components/section";
import { ctx } from "@/init";
import { GameStateManager } from "@/manager/gameStateManager";
import { Button } from "@/page/components/button";
import { ServerHandler } from "@/server/serverHandler";
import { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";

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

    this.image = new Image();
  }

  draw(): void {
    super.draw();

    const infoPanelData = GameStateManager.getInfoPanelData();

    if (infoPanelData) {
      ctx.fillText(
        infoPanelData.getName(),
        this.pos.x -
          ctx.measureText(infoPanelData.getName()).width / 2 +
          this.dim.width / 2,
        this.pos.y + 75
      );
    }

    ctx.drawImage(
      this.image,
      this.pos.x + this.dim.width / 2 - this.image.width / 2,
      this.pos.y + this.dim.height / 2 - this.image.height / 2 - 25,
      this.image.width,
      this.image.height
    );

    this.deleteButton.draw();
  }

  update(dt: number, mousePos: Position): void {
    this.deleteButton.update(dt, mousePos);

    const infoPanelData = GameStateManager.getInfoPanelData();

    if (
      infoPanelData &&
      ((infoPanelData.getEntity().data.url.length && !this.image.src.length) ||
        infoPanelData?.getEntity().data.url !== this.image.src)
    ) {
      this.image.src = infoPanelData.getEntity().data.static;
    }
  }

  public handleClick(mousePos: Position): void {
    if (this.deleteButton.isClicked(mousePos.x, mousePos.y)) {
      GameStateManager.setGameMenuState(GameStateManager.getPrevMenuState());
      ServerHandler.sendMessage(
        "game:destroy",
        GameStateManager.getInfoPanelData()?.getIndices()
      );
    }
  }
}
