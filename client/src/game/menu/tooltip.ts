import { ctx } from "@/init";
import { language, type Buildings } from "@/languages/language";
import { StateManager } from "@/manager/stateManager";
import { PageComponents } from "@/page/components/pageComponents";
import { Text } from "@/page/components/text";
import { settings } from "@/settings";
import type { Price } from "@/types/building.types";
import type { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";
import { getImageNameFromUrl } from "@/utils/utils";

export class Tooltip extends PageComponents {
  private triangleSize: number = 12;

  private topLeft: Position;
  private topRight: Position;
  private bottom: Position;

  private houseNameText: Text;
  private boardsText: Text;
  private stoneText: Text;

  public constructor(pos: Position, dim: Dimension) {
    super(pos, dim);

    this.houseNameText = new Text(new Position(this.pos.x, this.pos.y), "", {
      fontSize: "16px",
    });

    this.boardsText = new Text(new Position(this.pos.x, this.pos.y), "", {
      fontSize: "16px",
    });

    this.stoneText = new Text(new Position(this.pos.x, this.pos.y), "", {
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

    this.boardsText.setCenter({
      xFrom: this.pos.x,
      xTo: this.dim.width,
      yFrom: this.pos.y + 32,
      yTo: 0,
    });

    this.stoneText.setCenter({
      xFrom: this.pos.x,
      xTo: this.dim.width,
      yFrom: this.pos.y + 48,
      yTo: 0,
    });
  }

  public draw(): void {
    super.draw();

    ctx.save();
    ctx.fillStyle = settings.color.lightBrown;
    ctx.fillRect(this.pos.x, this.pos.y, this.dim.width, this.dim.height);

    ctx.beginPath();
    ctx.moveTo(this.topLeft.x, this.topLeft.y);
    ctx.lineTo(this.topRight.x, this.topRight.y);
    ctx.lineTo(this.bottom.x, this.bottom.y);

    ctx.fill();
    ctx.closePath();

    ctx.restore();

    this.houseNameText.draw();
    this.boardsText.draw();
    this.stoneText.draw();
  }

  public update(dt: number, mousePos: Position): void {
    super.update(dt, mousePos);
  }

  public setHouseName(text: string): void {
    this.houseNameText.setText(text);

    this.houseNameText.setCenter({
      xFrom: this.pos.x,
      xTo: this.dim.width,
      yFrom: this.pos.y + 16,
      yTo: 0,
    });
  }

  public setHousePrices(image: string) {
    const houseName: string = getImageNameFromUrl(image);
    const prices: Price | undefined =
      StateManager.getBuildingPrices()[houseName as Buildings];

    if (prices) {
      const boardsAmount: number =
        StateManager.getBuildingPrices()[houseName as Buildings].boards;

      const stoneAmount: number =
        StateManager.getBuildingPrices()[houseName as Buildings].stone;

      const boardsText = language[StateManager.getLanguage()].storage.boards;
      const stoneText = language[StateManager.getLanguage()].storage.stone;

      this.boardsText.setText(`${boardsAmount} x ${boardsText}`);
      this.stoneText.setText(`${stoneAmount} x ${stoneText}`);

      this.boardsText.setCenter({
        xFrom: this.pos.x,
        xTo: this.dim.width,
        yFrom: this.pos.y + 32,
        yTo: 0,
      });

      this.stoneText.setCenter({
        xFrom: this.pos.x,
        xTo: this.dim.width,
        yFrom: this.pos.y + 48,
        yTo: 0,
      });
    }
  }
}
