import { ctx } from "../init";
import { CELL_SIZE } from "../settings";
import { Position } from "./position";

export class RangeIndicator {
  private position: Position;
  private radius: number;
  private numPoints: number = 360;

  private cartesianCenter: Position;
  private circlePoints: Position[];
  private color: string;

  constructor(pos: Position, radius: number, color: string) {
    this.position = pos;
    this.radius = radius * CELL_SIZE;
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
      // ctx.strokeStyle = this.color;
      ctx.strokeStyle = "yellow";
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.1;
      const center: Position = this.cartesianToIsometric(this.cartesianCenter);

      for (let i = 0; i < this.numPoints; ++i) {
        const isoPoint: Position = this.cartesianToIsometric(
          this.circlePoints[i]
        );
        ctx.moveTo(center.x, center.y);
        ctx.lineTo(isoPoint.x, isoPoint.y);
      }

      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }
  }

  public update(pos: Position): void {
    this.cartesianCenter = this.isometricToCartesian(pos);
    this.circlePoints = this.generateCirclePoints(this.cartesianCenter);
  }

  private cartesianToIsometric(pos: Position): Position {
    const { x, y } = pos;
    const isoX = (x - y) * Math.cos(Math.PI / 6);
    const isoY = (x + y) * Math.sin(Math.PI / 6);
    return new Position(isoX, isoY);
  }

  private isometricToCartesian(iso: Position): Position {
    const x =
      (iso.x / Math.cos(Math.PI / 6) + iso.y / Math.sin(Math.PI / 6)) / 2;
    const y =
      (iso.y / Math.sin(Math.PI / 6) - iso.x / Math.cos(Math.PI / 6)) / 2;
    return new Position(x, y);
  }

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
