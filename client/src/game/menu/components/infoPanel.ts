import { Section } from "@/game/menu/components/section";
import { ctx } from "@/init";
import { StateManager } from "@/manager/stateManager";
import { Button } from "@/page/components/button";
import { ServerHandler } from "@/server/serverHandler";
import { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";
import { Building } from "@/game/world/building/building";
import { Unit } from "@/game/world/unit/unit";

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

  // FIXME: nem kell folyton lekérdeni az infoPanelData-t kell egy setter rá
  public draw(): void {
    super.draw();

    const infoPanelData = StateManager.getInfoPanelData();

    if (infoPanelData) {
      let name: string = "";
      if (infoPanelData instanceof Building) {
        name = infoPanelData.getBuildingName();
      } else if (infoPanelData instanceof Unit) {
        name = infoPanelData.getUnitName();
      }

      ctx.fillText(
        name,
        this.pos.x - ctx.measureText(name).width / 2 + this.dim.width / 2,
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

    if (infoPanelData instanceof Building) {
      this.deleteButton.draw();
    }
  }

  public update(dt: number, mousePos: Position): void {
    this.deleteButton.update(dt, mousePos);

    const infoPanelData = StateManager.getInfoPanelData();

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
      StateManager.setGameMenuState(StateManager.getPrevMenuState());
      ServerHandler.sendMessage(
        "game:destroy",
        StateManager.getInfoPanelData()?.getIndices()
      );
    }
  }
}
