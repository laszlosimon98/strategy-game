import { ctx } from "../../init";
import { Dimension } from "../../utils/dimension";
import { Indices } from "../../utils/indices";
import { Position } from "../../utils/position";

export class Building {
  private indices: Indices;
  private pos: Position;
  private image: HTMLImageElement;
  private dimension: Dimension;
  private renderPos: Position;

  private IsRenderPosSet: boolean;

  public constructor(
    indices: Indices,
    src: string,
    width: number,
    height: number
  ) {
    this.indices = indices;
    this.pos = Position.zero();
    this.renderPos = Position.zero();
    this.IsRenderPosSet = false;

    this.image = new Image();
    this.image.src = src;

    this.dimension = new Dimension(width, height);
  }

  public draw(): void {
    if (this.IsRenderPosSet) {
      ctx.drawImage(this.image, this.renderPos.x, this.renderPos.y);
      ctx.save();
      ctx.strokeStyle = "#f00";
      ctx.strokeRect(
        this.renderPos.x,
        this.renderPos.y,
        this.dimension.width,
        this.dimension.height
      );
      ctx.restore();
    }
  }

  public update(cameraScroll: Position): void {
    if (!this.IsRenderPosSet) {
      this.IsRenderPosSet = true;
    }

    this.renderPos = new Position(
      this.pos.x + cameraScroll.x,
      this.pos.y + cameraScroll.y
    );
  }

  public getDimension(): Dimension {
    return this.dimension;
  }

  public setPos(pos: Position): void {
    this.pos = pos;
  }

  public getIndices(): Indices {
    return this.indices;
  }
}
