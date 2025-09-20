import { ctx } from "@/init";
import { PageComponents } from "@/page/components/pageComponents";
import { Text } from "@/page/components/text";
import { settings } from "@/settings";
import type { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";

export class Tooltip extends PageComponents {
  private triangleSize: number = 12;

  private topLeft: Position;
  private topRight: Position;
  private bottom: Position;

  private houseName: Text;
  private wood: Text;
  private stone: Text;

  public constructor(pos: Position, dim: Dimension) {
    super(pos, dim);

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

    this.houseName = new Text(new Position(this.pos.x, this.pos.y), "", {
      fontSize: "16px",
    });

    this.wood = new Text(new Position(this.pos.x, this.pos.y), "Fa x 3", {
      fontSize: "16px",
    });

    this.stone = new Text(new Position(this.pos.x, this.pos.y), "Kő x 1", {
      fontSize: "16px",
    });
    this.wood.setCenter({
      xFrom: this.pos.x,
      xTo: this.dim.width,
      yFrom: this.pos.y + 32,
      yTo: 0,
    });
    this.stone.setCenter({
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

    this.houseName.draw();
    this.wood.draw();
    this.stone.draw();
  }

  public update(dt: number, mousePos: Position): void {
    super.update(dt, mousePos);
  }

  public setHouseName(text: string): void {
    this.houseName.setText(text);
    this.houseName.setCenter({
      xFrom: this.pos.x,
      xTo: this.dim.width,
      yFrom: this.pos.y + 16,
      yTo: 0,
    });
  }
}
