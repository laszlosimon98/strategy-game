import { canvasHeight, canvasWidth, ctx } from "../../init";
import { TILE_SIZE } from "../../settings";
import { Indices } from "../../utils/indices";
import { Position } from "../../utils/position";
import { Vector } from "../../utils/vector";

export class Tile {
  private indices: Indices;
  private position: Vector;
  private renderPos: Position;
  private buildingPos: Position;
  private unitPos: Position;
  private cameraPos: Position;

  private isometricPos: Position[];
  private image: HTMLImageElement;
  private temp: boolean = false;

  public constructor(indices: Indices, type: string) {
    this.indices = indices;
    this.position = new Vector(indices.i, indices.j);

    this.isometricPos = this.position.getIsometricPos();

    this.renderPos = new Position(
      this.isometricPos[0].x - TILE_SIZE,
      this.isometricPos[0].y - 1
    );

    this.buildingPos = new Position(
      this.isometricPos[2].x,
      this.isometricPos[2].y
    );

    this.unitPos = new Position(
      this.isometricPos[2].x,
      this.isometricPos[2].y - TILE_SIZE / 4
    );

    this.cameraPos = new Position(
      canvasWidth / 2 - this.isometricPos[0].x,
      canvasHeight / 4 +
        canvasHeight / 4 -
        this.isometricPos[0].y -
        TILE_SIZE / 2
    );

    this.image = new Image();
    this.image.src = type;
  }

  public setTemp(): void {
    this.temp = !this.temp;
  }

  public draw(): void {
    ctx.save();
    if (this.temp) {
      ctx.globalAlpha = 0.5;
    }
    ctx.drawImage(this.image, this.renderPos.x, this.renderPos.y);
    ctx.restore();
  }

  public update(cameraScroll: Position): void {
    this.renderPos = new Position(
      this.isometricPos[0].x - TILE_SIZE + cameraScroll.x,
      this.isometricPos[0].y - 1 + cameraScroll.y
    );
  }

  public getCameraPos(): Position {
    return this.cameraPos;
  }

  public getBuildingPos(): Position {
    return this.buildingPos;
  }

  public getUnitPos(): Position {
    return this.unitPos;
  }

  public getIndices(): Indices {
    return this.indices;
  }

  private drawGrid(grid: Position[]): void {
    ctx.beginPath();
    for (let i = 0; i < grid.length - 1; ++i) {
      const current: Position = grid[i];
      const next: Position = grid[i + 1];

      ctx.moveTo(current.x, current.y);
      ctx.lineTo(next.x, next.y);
    }

    const last: Position = grid[grid.length - 1];
    const first: Position = grid[0];

    ctx.moveTo(last.x, last.y);
    ctx.lineTo(first.x, first.y);

    ctx.strokeStyle = "#fff";
    ctx.stroke();
    ctx.closePath();
  }

  public drawNormalGrid(): void {
    this.drawGrid(this.position.getNormalPos());
  }

  public drawIsometricGrid(): void {
    this.drawGrid(this.position.getIsometricPos());
  }
}
