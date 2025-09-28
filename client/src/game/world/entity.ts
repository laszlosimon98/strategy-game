import { StateManager } from "@/manager/stateManager";
import { ctx } from "@/init";
import type { RendererInterface } from "@/interfaces/rendererInterface";
import { language, type Buildings, type Units } from "@/languages/language";
import type { EntityType } from "@/types/game.types";
import { Dimension } from "@/utils/dimension";
import { Indices } from "@/utils/indices";
import { Position } from "@/utils/position";
import { getImageNameFromUrl } from "@/utils/utils";

export abstract class Entity implements RendererInterface {
  protected image: HTMLImageElement;
  protected renderPos: Position;

  protected isHovered: boolean;
  protected entity: EntityType;

  protected constructor(entity: EntityType) {
    this.entity = {
      data: {
        ...entity.data,
        static: entity.data.url,
      },
    };
    this.renderPos = new Position(0, -500);

    this.isHovered = false;

    this.image = new Image(
      entity.data.dimensions.width,
      entity.data.dimensions.height
    );
    this.image.src = entity.data.url;
  }

  public equal(other: EntityType): boolean {
    return this.entity.data.id === other.data.id;
  }

  public draw(): void {
    ctx.drawImage(this.image, this.renderPos.x, this.renderPos.y);
  }

  public update(dt: number, cameraScroll: Position): void {
    this.renderPos = new Position(
      this.entity.data.position.x + cameraScroll.x,
      this.entity.data.position.y + cameraScroll.y
    );
  }

  public setEntity(entity: EntityType): void {
    this.entity = entity;
  }

  public getEntity(): EntityType {
    return this.entity;
  }

  public setDimension(dim: Dimension): void {
    this.entity.data.dimensions = dim;
  }

  public getDimension(): Dimension {
    return this.entity.data.dimensions;
  }

  public setPosition(pos: Position): void {
    this.entity.data.position = pos;
  }

  public getPosition(): Position {
    return this.entity.data.position;
  }

  public getIndices(): Indices {
    return this.entity.data.indices;
  }

  public setIndices(indices: Indices): void {
    this.entity.data.indices = indices;
  }

  public setHover(hover: boolean): void {
    this.isHovered = hover;
  }

  public getBuildingName(): string {
    const objectName: string =
      language[StateManager.getLanguage()].buildings[
        getImageNameFromUrl(this.entity.data.static) as unknown as Buildings
      ];
    return objectName;
  }

  public getUnitName(): string {
    const objectName: string =
      language[StateManager.getLanguage()].units[
        getImageNameFromUrl(this.entity.data.static) as unknown as Units
      ];
    return objectName;
  }

  protected setImage(image: string): void {
    this.image.src = image;
  }
}
