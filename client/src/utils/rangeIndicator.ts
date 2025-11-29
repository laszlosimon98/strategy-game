import { ctx } from "@/init";
import { settings } from "@/settings";
import { Position } from "@/utils/position";
import { cartesianToIsometric, isometricToCartesian } from "@/utils/utils";

/**
 * Hatótávolságot kirajzoló osztály
 */
export class RangeIndicator {
  private radius: number;
  private numPoints: number = 360;

  private cartesianCenter: Position;
  private circlePoints: Position[];
  private color: string | undefined;

  constructor(radius: number, color?: string) {
    this.radius = radius * settings.size.cell;
    this.color = color;

    this.cartesianCenter = Position.zero();
    this.circlePoints = [];
  }

  public getRange(): number {
    return this.radius;
  }

  public draw() {
    if (this.circlePoints.length) {
      ctx.save();
      ctx.beginPath();
      if (this.color) {
        ctx.strokeStyle = this.color;
      } else {
        ctx.strokeStyle = "yellow";
      }

      ctx.lineWidth = 5;
      ctx.globalAlpha = 0.1;
      const center: Position = cartesianToIsometric(this.cartesianCenter);

      for (let i = 0; i < this.numPoints; ++i) {
        const isoPoint: Position = cartesianToIsometric(this.circlePoints[i]);
        ctx.moveTo(center.x, center.y);
        ctx.lineTo(isoPoint.x, isoPoint.y);
      }

      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }
  }

  public update(pos: Position): void {
    this.cartesianCenter = isometricToCartesian(pos);
    this.circlePoints = this.generateCirclePoints(this.cartesianCenter);
  }

  /**
   * Meghatároz egy `numPoints` mennyiségű `radius` méretű pontokból álló kört
   * @param center az a pozíció, ahol az objektum található
   * @returns koordináta lista
   */
  private generateCirclePoints(center: Position): Position[] {
    const points: Position[] = [];

    for (let i = 0; i < this.numPoints; i++) {
      const angle = (i / this.numPoints) * 2 * Math.PI;
      const x = center.x + this.radius * Math.cos(angle);
      const y = center.y + this.radius * Math.sin(angle);
      points.push(new Position(x, y));
    }
    return points;
  }
}
