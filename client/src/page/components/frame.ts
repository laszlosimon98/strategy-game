import { ctx } from "@/init";
import { Button } from "@/page/components/button";
import { PageComponents } from "@/page/components/pageComponents";
import { settings } from "@/settings";
import { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";

interface FrameOptions {
  alpha?: number;
  color?: string;
}

export class Frame extends PageComponents {
  protected buttons: Button[] = [];
  private alpha: number;
  private color: string;

  public constructor(pos: Position, dim: Dimension, options: FrameOptions) {
    super(pos, dim);
    this.alpha = options?.alpha || 1;
    this.color = options?.color || settings.color.brown;
  }

  public draw(): void {
    super.draw();

    ctx.save();

    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;

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

    ctx.fillStyle = this.hexToRgba(this.color, this.alpha);
    ctx.fill();

    this.buttons.forEach((btn) => btn.draw());

    ctx.restore();
  }

  public getButtons(): Button[] {
    return this.buttons;
  }

  protected hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}
