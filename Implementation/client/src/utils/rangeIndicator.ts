import { ctx } from "../init";
import { TILE_SIZE } from "../settings";
import { Position } from "./position";

export class RangeIndicator {
  private radius: number;
  private numPoints: number = 100;

  private cartesianCenter: Position;
  private circlePoints: Position[];
  private color: string;

  constructor(radius: number, color: string) {
    this.radius = radius * TILE_SIZE;
    this.color = color;

    this.cartesianCenter = Position.zero();
    this.circlePoints = [];
  }

  public draw() {
    if (this.circlePoints.length) {
      const firstPoint = this.cartesianToIsometric(this.circlePoints[0]);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(firstPoint.x, firstPoint.y);

      ctx.strokeStyle = this.color;
      ctx.lineWidth = 2;

      for (let i = 1; i < this.numPoints; i++) {
        const isoPoint = this.cartesianToIsometric(this.circlePoints[i]);
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
