import { ctx } from "../../init";
import { TILE_SIZE } from "../../settings";
import { Point } from "../../utils/point";
import { Vector } from "../../utils/vector";

export class Tile {
  private position: Vector;
  private renderPos: Point;
  private isometricCoords: Point[];

  private image: HTMLImageElement;

  constructor(i: number, j: number, type: string) {
    this.position = new Vector(i, j);

    this.image = new Image();
    this.image.src = type;

    this.isometricCoords = this.position.getIsometricCoords();

    this.renderPos = new Point(
      this.isometricCoords[0].x - TILE_SIZE,
      this.isometricCoords[0].y - 1
    );
  }

  private drawGrid(grid: Point[]): void {
    ctx.beginPath();
    for (let i = 0; i < grid.length - 1; ++i) {
      const current: Point = grid[i];
      const next: Point = grid[i + 1];

      ctx.moveTo(current.x, current.y);
      ctx.lineTo(next.x, next.y);
    }

    const last: Point = grid[grid.length - 1];
    const first: Point = grid[0];

    ctx.moveTo(last.x, last.y);
    ctx.lineTo(first.x, first.y);

    ctx.strokeStyle = "#fff";
    ctx.stroke();
    ctx.closePath();
  }

  drawNormalGrid(): void {
    this.drawGrid(this.position.getNormalCoords());
  }

  drawIsometricGrid(): void {
    this.drawGrid(this.position.getIsometricCoords());
  }

  draw(): void {
    ctx.drawImage(this.image, this.renderPos.x, this.renderPos.y);
  }
}
