import { ctx } from "../../init";
import { MouseIntersect } from "../../interfaces/mouseIntersect";
import { RenderInterface } from "../../interfaces/render";
import { BuildingType } from "../../types/gameType";
import { Dimension } from "../../utils/dimension";
import { Indices } from "../../utils/indices";
import { Position } from "../../utils/position";

export class Building implements RenderInterface, MouseIntersect {
  private pos: Position;
  private image: HTMLImageElement;
  private renderPos: Position;

  private isRenderPosSet: boolean;
  private building: BuildingType;

  private isHovered: boolean;

  public constructor(building: BuildingType) {
    this.building = building;
    this.pos = new Position(0, -500);
    this.renderPos = new Position(0, -500);
    this.isRenderPosSet = false;

    this.isHovered = false;

    this.image = new Image(
      building.data.dimensions.width,
      building.data.dimensions.height
    );
    this.image.src = building.data.url;
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

  public setBuilding(building: BuildingType) {
    this.building.data = { ...building.data };
    this.image.src = this.building.data.url;
  }

  public getBuilding(): BuildingType {
    return this.building;
  }

  public getBuildingName(): string | undefined {
    if (this.building.data.url) {
      return this.building.data.url.split("/")[6].split(".")[0];
    }
  }

  public getDimension(): Dimension {
    return this.building.data.dimensions;
  }

  public setPosition(pos: Position): void {
    this.pos = pos;
  }

  public getPosition(): Position {
    return this.pos;
  }

  public getIndices(): Indices {
    return this.building.data.indices;
  }
}
