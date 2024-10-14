import { ctx } from "../../init";
import { Dimension } from "../../utils/dimension";
import { Indices } from "../../utils/indices";
import { Position } from "../../utils/position";
import { BuildingType } from "../types/types";

export class Building {
  private indices: Indices;
  private pos: Position;
  private image: HTMLImageElement;
  private dimension: Dimension;
  private renderPos: Position;

  private isRenderPosSet: boolean;

  public constructor(indices: Indices, building: BuildingType) {
    this.indices = indices;
    this.pos = Position.zero();
    this.renderPos = Position.zero();
    this.isRenderPosSet = false;

    this.image = new Image(
      building.dimensions.width,
      building.dimensions.height
    );
    this.image.src = building.url;

    this.dimension = new Dimension(this.image.width, this.image.height);
  }

  public draw(): void {
    if (this.isRenderPosSet) {
      ctx.drawImage(this.image, this.renderPos.x, this.renderPos.y);
      // ctx.save();
      // ctx.strokeStyle = "#f00";
      // ctx.strokeRect(
      //   this.renderPos.x,
      //   this.renderPos.y,
      //   this.dimension.width,
      //   this.dimension.height
      // );
      // ctx.restore();
    }
  }

  public update(cameraScroll: Position): void {
    if (!this.isRenderPosSet) {
      this.isRenderPosSet = true;
    }

    this.renderPos = new Position(
      this.pos.x + cameraScroll.x,
      this.pos.y + cameraScroll.y
    );
  }

  public getDimension(): Dimension {
    return this.dimension;
  }

  public setDimension(dimension: Dimension): void {
    this.dimension = dimension;
  }

  public setPos(pos: Position): void {
    this.pos = pos;
  }

  public getIndices(): Indices {
    return this.indices;
  }
}
