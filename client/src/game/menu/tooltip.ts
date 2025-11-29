import { ctx } from "@/init";
import { language, type Buildings } from "@/languages/language";
import { StateManager } from "@/manager/stateManager";
import { Frame } from "@/page/components/frame";
import { Text } from "@/page/components/text";
import { settings } from "@/settings";
import type { Price } from "@/types/building.types";
import type { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";

/**
 * Rövid információs ablak, amely megjeleníti egy épület vagy egység
 * nevét és a szükséges erőforrásokat.
 */
export class Tooltip extends Frame {
  private triangleSize: number = 12;

  private topLeft: Position;
  private topRight: Position;
  private bottom: Position;

  private name: Text;
  private needsA: Text;
  private needsB: Text;

  public constructor(pos: Position, dim: Dimension) {
    super(pos, dim);

    this.name = new Text(new Position(this.pos.x, this.pos.y), "", {
      fontSize: "16px",
    });

    this.needsA = new Text(new Position(this.pos.x, this.pos.y), "", {
      fontSize: "16px",
    });

    this.needsB = new Text(new Position(this.pos.x, this.pos.y), "", {
      fontSize: "16px",
    });

    this.topLeft = new Position(
      this.pos.x + this.dim.width / 2 - this.triangleSize,
      this.pos.y + this.dim.height - 1
    );
    this.topRight = new Position(
      this.pos.x + this.dim.width / 2 + this.triangleSize,
      this.pos.y + this.dim.height - 1
    );
    this.bottom = new Position(
      this.pos.x + this.dim.width / 2,
      this.pos.y + this.dim.height - 1 + this.triangleSize * 1.5
    );
  }

  public draw(): void {
    super.draw();

    ctx.save();
    ctx.fillStyle = settings.color.lightBrown;

    ctx.beginPath();
    ctx.moveTo(this.topLeft.x, this.topLeft.y);
    ctx.lineTo(this.topRight.x, this.topRight.y);
    ctx.lineTo(this.bottom.x, this.bottom.y);

    ctx.fill();
    ctx.closePath();

    ctx.restore();

    this.name.draw();
    this.needsA.draw();
    this.needsB.draw();
  }

  public update(dt: number, mousePos: Position): void {
    super.update(dt, mousePos);
  }

  public setName(text: string): void {
    this.name.setText(text);

    this.name.setCenter({
      xFrom: this.pos.x,
      xTo: this.dim.width,
      yFrom: this.pos.y + 16,
      yTo: 0,
    });
  }

  /**
   * Beállítja az adott házhoz tartozó árakat, amelyek megjelennek az ikon felett
   * @param houseName ház neve
   */
  public setHousePrices(houseName: string): void {
    const prices: Price | undefined =
      StateManager.getBuildingPrices()[houseName as Buildings];

    if (prices) {
      const boardsAmount: number =
        StateManager.getBuildingPrices()[houseName as Buildings].boards;

      const stoneAmount: number =
        StateManager.getBuildingPrices()[houseName as Buildings].stone;

      const boardsText: string =
        language[StateManager.getLanguage()].storage.boards;
      const stoneText: string =
        language[StateManager.getLanguage()].storage.stone;

      this.needsA.setText(`${boardsAmount} x ${boardsText}`);
      this.needsB.setText(`${stoneAmount} x ${stoneText}`);

      this.setTextsCenter();
    }
  }

  /**
   * Beállítja az adott egységhez tartozó árakat, amelyek megjelennek az ikon felett
   * @param houseName egység neve
   */
  public setUnitPrices(unitName: string): void {
    const swordText: string =
      language[StateManager.getLanguage()].storage.sword;
    const shieldText: string =
      language[StateManager.getLanguage()].storage.shield;
    const bowText: string = language[StateManager.getLanguage()].storage.bow;

    if (unitName === "archer") {
      this.needsA.setText(`1 x ${bowText}`);
    } else if (unitName === "knight") {
      this.needsA.setText(`1 x ${swordText}`);
      this.needsB.setText(`1 x ${shieldText}`);
    }

    this.setTextsCenter();
  }

  private setTextsCenter(): void {
    this.needsA.setCenter({
      xFrom: this.pos.x,
      xTo: this.dim.width,
      yFrom: this.pos.y + 48,
      yTo: 0,
    });

    this.needsB.setCenter({
      xFrom: this.pos.x,
      xTo: this.dim.width,
      yFrom: this.pos.y + 72,
      yTo: 0,
    });
  }
}
