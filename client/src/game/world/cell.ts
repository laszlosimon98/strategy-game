import { CellTypeEnum } from "@/game/enums/cellTypeEnum";
import { canvasWidth, canvasHeight, ctx } from "@/init";
import { settings } from "@/settings";
import { Indices } from "@/utils/indices";
import { Position } from "@/utils/position";
import { Vector } from "@/utils/vector";

export class Cell {
  private indices: Indices;
  private position: Vector;

  private renderPos: Position;
  private buildingPos: Position;
  private unitPos: Position;
  private cameraPos: Position;
  private obstaclePos: Position;

  private isometricPos: Position[];
  private image: HTMLImageElement;
  private obstacleImage: HTMLImageElement | null = null;

  public constructor(indices: Indices, type: string, obstacle?: string) {
    this.indices = indices;
    this.position = new Vector(indices.i, indices.j);

    this.isometricPos = this.position.getIsometricPos();

    this.renderPos = new Position(
      this.isometricPos[0].x - settings.size.cell,
      this.isometricPos[0].y - 1
    );

    this.buildingPos = new Position(
      this.isometricPos[2].x,
      this.isometricPos[2].y
    );

    this.unitPos = new Position(
      this.isometricPos[2].x,
      this.isometricPos[2].y - settings.size.cell / 4
    );

    this.cameraPos = new Position(
      canvasWidth / 2 - this.isometricPos[0].x,
      canvasHeight / 4 +
        canvasHeight / 4 -
        this.isometricPos[0].y -
        settings.size.cell / 2
    );

    this.obstaclePos = new Position(
      this.isometricPos[0].x,
      this.isometricPos[0].y - 64
    );

    this.image = new Image();
    this.image.src = type;

    if (obstacle) {
      this.obstacleImage = new Image();
      this.obstacleImage.src = obstacle;
    }
  }

  public draw(): void {
    ctx.drawImage(this.image, this.renderPos.x, this.renderPos.y);
  }

  public drawObstacles(): void {
    if (this.obstacleImage) {
      ctx.drawImage(this.obstacleImage, this.obstaclePos.x, this.obstaclePos.y);
    }
  }

  public update(cameraScroll: Position): void {
    this.renderPos = new Position(
      this.isometricPos[0].x - settings.size.cell + cameraScroll.x,
      this.isometricPos[0].y - 1 + cameraScroll.y
    );

    if (this.obstacleImage) {
      this.obstaclePos = new Position(
        this.isometricPos[0].x - this.obstacleImage.width / 2 + cameraScroll.x,
        this.isometricPos[0].y - this.obstacleImage.height / 2 + cameraScroll.y
      );
    }
  }

  public setImage(image: string): void {
    this.image.src = image;
  }

  public setObstacleImage(image: string): void {
    if (image === CellTypeEnum.Empty) {
      this.obstacleImage = null;
      return;
    }

    this.obstacleImage = new Image();
    this.obstacleImage.src = image;
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
