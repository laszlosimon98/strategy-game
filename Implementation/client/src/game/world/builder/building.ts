import { state } from "../../../data/state";
import { ctx } from "../../../init";
import { ChangeAble } from "../../../interfaces/changeAble";
import { RenderInterface } from "../../../interfaces/render";
import { EntityType } from "../../../types/gameType";
import { Position } from "../../../utils/position";
import { getImageNameFromUrl } from "../../../utils/utils";
import { Entity } from "../entity";
import { Flag } from "./flag";

export class Building extends Entity implements RenderInterface, ChangeAble {
  private flagEntity: EntityType;
  private flag: Flag;

  public constructor(building: EntityType) {
    super(building);

    this.flagEntity = {
      data: {
        ...state.images.colors[state.game.players[building.data.owner].color]
          .flag,
        indices: {
          ...building.data.indices,
          i: building.data.indices.i + 1,
        },
        owner: building.data.owner,
      },
    };

    this.flag = new Flag(this.flagEntity);
  }

  public draw(): void {
    super.draw();

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

    this.flag.draw();
  }

  public update(dt: number, cameraScroll: Position): void {
    super.update(dt, cameraScroll);
    this.flag.update(dt, cameraScroll);
  }

  public setPosition(pos: Position): void {
    super.setPosition(pos);

    const flagPosition: Position = new Position(
      this.pos.x -
        this.flag.getDimension().width / 2 +
        this.getDimension().width,
      this.pos.y - this.flag.getDimension().height + this.getDimension().height
    );
    this.flag.setPosition(flagPosition);
  }

  public setBuilding(building: EntityType) {
    this.entity.data = { ...building.data };
    this.image.src = this.entity.data.url;
  }

  public getBuilding(): EntityType {
    return this.entity;
  }

  public getBuildingName(): string | undefined {
    if (this.entity.data.url) {
      return getImageNameFromUrl(this.entity.data.url);
    }
  }
}
