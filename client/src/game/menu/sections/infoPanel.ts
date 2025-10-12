import { Section } from "@/game/menu/sections/section";
import { ctx } from "@/init";
import { StateManager } from "@/manager/stateManager";
import { Button } from "@/page/components/button";
import { ServerHandler } from "@/server/serverHandler";
import { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";
import { Building } from "@/game/world/building/building";
import { Text } from "@/page/components/text";
import { settings } from "@/settings";
import { Barracks } from "@/game/world/building/buildings/military/barracks";
import { BarracksPanel } from "@/game/menu/sections/panels/barracksPanel";
import { Soldier } from "@/game/world/unit/units/soldier";
import { SoldierPanel } from "@/game/menu/sections/panels/soldierPanel";

export class InfoPanel extends Section {
  private deleteButton: Button;
  private image: HTMLImageElement;
  private displaySelectedObjectName: Text;
  private infoPanelData: Soldier | Building | undefined;

  private barracksPanel: BarracksPanel;
  private soldierPanel: SoldierPanel;

  public constructor(pos: Position, dim: Dimension) {
    super(pos, dim);

    this.deleteButton = new Button(
      new Position(pos.x + dim.width - 30, pos.y + 55),
      new Dimension(25, 25),
      StateManager.getImages("ui", "plate"),
      "empty"
    );

    this.displaySelectedObjectName = new Text(
      new Position(this.pos.x + this.dim.width / 2, this.pos.y + 75),
      "",
      {
        fontSize: "32px",
      }
    );

    this.image = new Image();
    this.barracksPanel = new BarracksPanel(pos, dim);
    this.soldierPanel = new SoldierPanel(pos, dim);
  }

  public updateInfoPanel(): void {
    this.infoPanelData = StateManager.getInfoPanelData();
    this.soldierPanel.updateInfoPanel();
  }

  public draw(): void {
    super.draw();
    this.displaySelectedObjectName.draw();

    ctx.drawImage(
      this.image,
      this.pos.x + this.dim.width / 2 - this.image.width / 2,
      this.pos.y + this.dim.height / 2 - this.image.height / 2 - 25,
      this.image.width,
      this.image.height
    );

    if (this.infoPanelData instanceof Building) {
      this.deleteButton.draw();
      if (this.infoPanelData instanceof Barracks) {
        this.barracksPanel.draw();
      }
    } else if (this.infoPanelData instanceof Soldier) {
      this.soldierPanel.draw();
    }
  }

  public update(dt: number, mousePos: Position): void {
    this.deleteButton.update(dt, mousePos);

    if (this.infoPanelData) {
      if (this.infoPanelData instanceof Building) {
        this.displaySelectedObjectName.setText(
          this.infoPanelData.getBuildingName()
        );

        if (this.infoPanelData instanceof Barracks) {
          this.barracksPanel.update(dt, mousePos);
        }
      } else if (this.infoPanelData instanceof Soldier) {
        this.displaySelectedObjectName.setText(
          this.infoPanelData.getUnitName()
        );
        this.soldierPanel.update();
      }

      if (
        (this.infoPanelData.getEntity().data.url.length &&
          !this.image.src.length) ||
        this.infoPanelData?.getEntity().data.url !== this.image.src
      ) {
        this.image.src = this.infoPanelData.getEntity().data.static;
      }

      this.displaySelectedObjectName.setCenter({
        xFrom: this.pos.x,
        xTo: settings.gameMenu.dim.width,
        yFrom: settings.gameMenu.pos.y,
        yTo: settings.gameMenu.dim.height / 2,
      });
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

    this.barracksPanel.handleClick(mousePos);
  }
}
