import { ctx } from "@/init";
import { Button } from "@/page/components/button";
import { PageComponents } from "@/page/components/pageComponents";
import { settings } from "@/settings";
import { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";

export class Frame extends PageComponents {
  protected buttons: Button[] = [];

  public constructor(pos: Position, dim: Dimension) {
    super(pos, dim);
  }

  public draw(): void {
    super.draw();

    ctx.save();

    // Árnyék
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;

    // Kerekített téglalap
    const radius = 8;
    const x = this.pos.x;
    const y = this.pos.y;
    const width = this.dim.width;
    const height = this.dim.height;

    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();

    // Gradient háttér
    const gradient = ctx.createLinearGradient(x, y, x, y + height);
    gradient.addColorStop(0, settings.color.brown);
    gradient.addColorStop(1, "#8B4513"); // Sötétebb barna
    ctx.fillStyle = gradient;
    ctx.fill();

    // Szegély
    ctx.strokeStyle = "#654321";
    ctx.lineWidth = 2;
    ctx.stroke();

    this.buttons.forEach((btn) => btn.draw());

    ctx.restore();
  }

  public getButtons(): Button[] {
    return this.buttons;
  }
}
