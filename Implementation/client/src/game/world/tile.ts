import { canvasHeight, canvasWidth, ctx } from "../../init";
import { TILE_SIZE } from "../../settings";
import { Position } from "../../utils/position";
import { Vector } from "../../utils/vector";

export class Tile {
  private position: Vector;
  private renderPos: Position;
  private buildingPos: Position;
  private unitPos: Position;
  private cameraPos: Position;

  private isometricPos: Position[];
  private image: HTMLImageElement;
  private offset: Position;
  private temp: boolean = false;

  public constructor(i: number, j: number, type: string) {
    this.position = new Vector(i, j);
    this.offset = Position.zero();

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
      // canvasWidth / 2 - this.isometricPos[0].x,
      // this.isometricPos[2].y - TILE_SIZE + canvasHeight / 4
    );

    this.image = new Image();
    this.image.src = type;
  }

  public setTemp(): void {
    this.temp = !this.temp;
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

  private drawGrid(grid: Position[]): void {
    ctx.beginPath();
    for (let i = 0; i < grid.length - 1; ++i) {
      const current: Position = grid[i];
      const next: Position = grid[i + 1];

      ctx.moveTo(current.x + this.offset.x, current.y + this.offset.y);
      ctx.lineTo(next.x + this.offset.x, next.y + this.offset.y);
    }

    const last: Position = grid[grid.length - 1];
    const first: Position = grid[0];

    ctx.moveTo(last.x + this.offset.x, last.y + this.offset.y);
    ctx.lineTo(first.x + this.offset.x, first.y + this.offset.y);

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

  public draw(): void {
    ctx.save();
    // if (this.temp) {
    //   ctx.globalCompositeOperation = "color";
    //   ctx.fillStyle = "rgb(255, 0, 0)";
    //   ctx.fillRect(this.renderPos.x, this.renderPos.y, TILE_SIZE, TILE_SIZE);
    //   ctx.globalCompositeOperation = "source-over";
    // }

    if (this.temp) {
      ctx.globalAlpha = 0.5;
    }
    ctx.drawImage(this.image, this.renderPos.x, this.renderPos.y);

    // ctx.font = "14px Arial";
    // const text = `${this.position.x}, ${this.position.y}`;
    // ctx.fillText(
    //   text,
    //   this.renderPos.x + TILE_SIZE / 2 + ctx.measureText(text).width / 2,
    //   this.renderPos.y + TILE_SIZE / 2
    // );
    ctx.restore();
  }

  public updateRenderPos(cameraScroll: Position): void {
    this.renderPos = new Position(
      this.isometricPos[0].x - TILE_SIZE + cameraScroll.x,
      this.isometricPos[0].y - 1 + cameraScroll.y
    );
  }
}
