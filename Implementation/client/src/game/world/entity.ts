import { ctx } from "../../init";
import { MouseIntersect } from "../../interfaces/mouseIntersect";
import { RenderInterface } from "../../interfaces/render";
import { EntityType } from "../../types/gameType";
import { Dimension } from "../../utils/dimension";
import { Indices } from "../../utils/indices";
import { Position } from "../../utils/position";

export abstract class Entity implements RenderInterface, MouseIntersect {
  protected pos: Position;
  protected image: HTMLImageElement;
  protected renderPos: Position;

  protected isHovered: boolean;
  protected entity: EntityType;

  constructor(entity: EntityType) {
    this.entity = entity;
    this.pos = new Position(0, -500);
    this.renderPos = new Position(0, -500);

    this.isHovered = false;

    this.image = new Image(
      entity.data.dimensions.width,
      entity.data.dimensions.height
    );
    this.image.src = entity.data.url;
  }

  public draw(): void {
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

  public update(dt: number, cameraScroll: Position): void {
    this.renderPos = new Position(
      this.pos.x + cameraScroll.x,
      this.pos.y + cameraScroll.y
    );
  }

  public getDimension(): Dimension {
    return this.entity.data.dimensions;
  }

  public setPosition(pos: Position): void {
    this.pos = pos;
  }

  public getPosition(): Position {
    return this.pos;
  }

  public getIndices(): Indices {
    return this.entity.data.indices;
  }

  public setHover(hover: boolean): void {
    this.isHovered = hover;
  }
}
