import { ctx } from "../../init";
import { TILE_SIZE } from "../../settings";
import { Point } from "../../utils/point";
import { Vector } from "../../utils/vector";
import { groundAssets } from "../imports/ground";

export class Tile {
  private position: Vector;
  private renderPos: Point;
  private buildingPos: Point;
  private isometricCoords: Point[];

  private image: HTMLImageElement;
  private building: HTMLImageElement;

  constructor(i: number, j: number, type: string) {
    this.position = new Vector(i, j);

    this.isometricCoords = this.position.getIsometricCoords();

    this.renderPos = new Point(
      this.isometricCoords[0].x - TILE_SIZE,
      this.isometricCoords[0].y - 1
    );

    this.buildingPos = new Point(
      this.isometricCoords[2].x,
      this.isometricCoords[2].y
    );

    this.image = new Image();
    this.image.src = type;

    this.building = new Image();
  }

  setTile(src: string) {
    this.image.src = src;
  }

  build(src: string): void {
    this.building.src = src;
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
}
