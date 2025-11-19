import { Section } from "@/game/menu/sections/section";
import type { Building } from "@/game/world/building/building";
import { Soldier } from "@/game/world/unit/units/soldier";
import { language, type Utils } from "@/languages/language";
import { StateManager } from "@/manager/stateManager";
import { Text } from "@/page/components/text";
import type { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";

export class SoldierPanel extends Section {
  private currentHealthText: Text;
  private defaultHealthText: Text;
  private separatorText: Text;
  private healthText: Text;
  private infoPanelData: Soldier | Building | null = null;

  constructor(pos: Position, dim: Dimension) {
    super(pos, dim);

    this.currentHealthText = new Text(new Position(pos.x, pos.y), "", {
      fontSize: "20px",
    });

    this.defaultHealthText = new Text(new Position(pos.x, pos.y), "", {
      fontSize: "20px",
    });

    this.separatorText = new Text(new Position(pos.x, pos.y), "/", {
      fontSize: "20px",
    });

    this.healthText = new Text(
      new Position(pos.x, pos.y),
      language[StateManager.getLanguage()].utils["hitPoints" as Utils],
      {
        fontSize: "20px",
      }
    );
  }

  public draw(): void {
    this.currentHealthText.draw();
    this.separatorText.draw();
    this.healthText.draw();
    this.defaultHealthText.draw();
  }

  public update(): void {
    if (this.infoPanelData instanceof Soldier) {
      this.currentHealthText.setText(
        `${this.infoPanelData.getCurrentHealth()}`
      );
      this.defaultHealthText.setText(`${this.infoPanelData.getHealth()}`);

      this.currentHealthText.setCenter({
        xFrom: this.pos.x,
        xTo: this.dim.width,
        yFrom: this.pos.y + this.dim.height - 50,
        yTo: 0,
      });

      this.defaultHealthText.setCenter({
        xFrom: this.pos.x,
        xTo: this.dim.width,
        yFrom: this.pos.y + this.dim.height - 50,
        yTo: 0,
      });

      this.separatorText.setCenter({
        xFrom: this.pos.x,
        xTo: this.dim.width,
        yFrom: this.pos.y + this.dim.height - 50,
        yTo: 0,
      });

      this.healthText.setCenter({
        xFrom: this.pos.x,
        xTo: this.dim.width + 25,
        yFrom: this.pos.y + this.dim.height - 80,
        yTo: 0,
      });

      const currentHealthPosition: Position = this.currentHealthText.getPos();
      const defaultHealthPosition: Position = this.defaultHealthText.getPos();

      this.currentHealthText.setPos(
        new Position(currentHealthPosition.x - 25, currentHealthPosition.y)
      );

      this.defaultHealthText.setPos(
        new Position(defaultHealthPosition.x + 25, defaultHealthPosition.y)
      );
    }
  }

  public updateInfoPanel(): void {
    this.infoPanelData = StateManager.getInfoPanelData();
  }
}
