import { ctx } from "../../init";
import { Dimension } from "../../utils/dimension";
import { Indices } from "../../utils/indices";
import { Position } from "../../utils/position";
import { BuildingType } from "../types/types";

export class Building {
  private indices: Indices;
  private pos: Position;
  private image: HTMLImageElement;
  private renderPos: Position;

  private isRenderPosSet: boolean;
  private building: BuildingType;

  public constructor(indices: Indices, building: BuildingType) {
    this.indices = indices;
    this.pos = new Position(0, -500);
    this.renderPos = new Position(0, -500);
    this.isRenderPosSet = false;
    this.building = building;

    this.image = new Image(
      building.dimensions.width,
      building.dimensions.height
    );
    this.image.src = building.url;
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

  public setBuilding(build: BuildingType) {
    this.building = { ...build };
    this.image.src = this.building.url;
  }

  public getBuilding(): BuildingType {
    return this.building;
  }

  public getDimension(): Dimension {
    return this.building.dimensions;
  }

  public setPos(pos: Position): void {
    this.pos = pos;
  }

  public getIndices(): Indices {
    return this.indices;
  }
}
