import { ctx } from "../../init";
import { UI } from "../../interfaces/ui";
import { Dimension } from "../../utils/dimension";
import { Indices } from "../../utils/indices";
import { Position } from "../../utils/position";
import { BuildingType } from "../types/types";

export class Building implements UI {
  private indices: Indices;
  private pos: Position;
  private image: HTMLImageElement;
  private renderPos: Position;

  private isRenderPosSet: boolean;
  private building: BuildingType;

  private isHovered: boolean;

  public constructor(indices: Indices, building: BuildingType) {
    this.indices = indices;
    this.pos = new Position(0, -500);
    this.renderPos = new Position(0, -500);
    this.isRenderPosSet = false;
    this.building = building;

    this.isHovered = false;

    this.image = new Image(
      building.dimensions.width,
      building.dimensions.height
    );
    this.image.src = building.url;
  }

  public action(): void {
    console.log("Szulo");
  }

  public draw(): void {
    if (this.isRenderPosSet) {
      ctx.drawImage(this.image, this.renderPos.x, this.renderPos.y);

      if (this.isHovered) {
        ctx.save();
        ctx.strokeStyle = "#fff";
        ctx.strokeRect(
          this.renderPos.x,
          this.renderPos.y,
          this.image.width,
          this.image.height
        );
        ctx.restore();
      }
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

  public setHover(hover: boolean): void {
    this.isHovered = hover;
  }

  public setBuilding(build: BuildingType) {
    this.building = { ...build };
    this.image.src = this.building.url;
  }

  public getBuilding(): BuildingType {
    return this.building;
  }

  public getBuildingName(): string {
    return this.building.url.split("/")[6].split(".")[0];
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

  public isMouseIntersect(mousePos: Position): boolean {
    const horizontal =
      mousePos.x >= this.pos.x && mousePos.x <= this.pos.x + this.image.width;
    const vertical =
      mousePos.y >= this.pos.y && mousePos.y <= this.pos.y + this.image.height;
    return horizontal && vertical;
  }
}
