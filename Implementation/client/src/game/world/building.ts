import { ctx } from "../../init";
import { RenderInterface } from "../../interfaces/render";
import { BuildingAssetType } from "../../types/gameType";
import { Dimension } from "../../utils/dimension";
import { Indices } from "../../utils/indices";
import { Position } from "../../utils/position";

export class Building implements RenderInterface {
  private indices: Indices;
  private pos: Position;
  private image: HTMLImageElement;
  private renderPos: Position;

  private isRenderPosSet: boolean;
  private building: BuildingAssetType;

  private isHovered: boolean;

  public constructor(indices: Indices, building: BuildingAssetType) {
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

  public update(dt: number, cameraScroll: Position): void {
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

  public setBuilding(build: BuildingAssetType) {
    this.building = { ...build };
    this.image.src = this.building.url;
  }

  public getBuilding(): BuildingAssetType {
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

  public getPos(): Position {
    return this.pos;
  }

  public getIndices(): Indices {
    return this.indices;
  }
}
