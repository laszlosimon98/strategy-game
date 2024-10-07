import { ctx } from "../../init";
import { TILE_SIZE } from "../../settings";
import { Point } from "../../utils/point";
import { Vector } from "../../utils/vector";

export class Tile {
  private position: Vector;
  private renderPos: Point;
  private buildingPos: Point;
  private isometricCoords: Point[];

  private image: HTMLImageElement;

  private offset: Point;

  constructor(i: number, j: number, type: string) {
    this.position = new Vector(i, j);
    this.offset = Point.zero();

    this.isometricCoords = this.position.getIsometricCoords();

    this.renderPos = new Point(
      this.isometricCoords[0].x - TILE_SIZE + this.offset.x,
      this.isometricCoords[0].y - 1 + this.offset.y
    );

    this.buildingPos = new Point(
      this.isometricCoords[2].x - this.offset.x,
      this.isometricCoords[2].y - this.offset.y
    );

    this.image = new Image();
    this.image.src = type;
  }

  getBuildingPos(): Point {
    return this.buildingPos;
  }

  private drawGrid(grid: Point[]): void {
    ctx.beginPath();
    for (let i = 0; i < grid.length - 1; ++i) {
      const current: Point = grid[i];
      const next: Point = grid[i + 1];

      ctx.moveTo(current.x + this.offset.x, current.y + this.offset.y);
      ctx.lineTo(next.x + this.offset.x, next.y + this.offset.y);
    }

    const last: Point = grid[grid.length - 1];
    const first: Point = grid[0];

    ctx.moveTo(last.x + this.offset.x, last.y + this.offset.y);
    ctx.lineTo(first.x + this.offset.x, first.y + this.offset.y);

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

    ctx.save();
    ctx.font = "14px Arial";
    const text = `${this.position.x}, ${this.position.y}`;
    ctx.fillText(
      text,
      this.renderPos.x + TILE_SIZE / 2 + ctx.measureText(text).width / 2,
      this.renderPos.y + TILE_SIZE / 2
    );
    ctx.restore();
  }

  updateRenderPos(cameraScroll: Point): void {
    this.renderPos = new Point(
      this.isometricCoords[0].x - TILE_SIZE + cameraScroll.x,
      this.isometricCoords[0].y - 1 + cameraScroll.y
    );
  }
}
