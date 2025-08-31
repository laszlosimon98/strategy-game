import { imagesFromState, playersFromState } from "@/game/data/state";
import { CallAble } from "@/game/interfaces/callAble";
import { ctx } from "@/game/main";
import { Position } from "@/game/utils/position";
import { Flag } from "@/game/world/building/flag";
import { Entity } from "@/game/world/entity";
import { EntityType } from "@/services/types/game.types";

export class Building extends Entity implements CallAble {
  private flagEntity: EntityType;
  private flag: Flag | undefined;

  public constructor(entity: EntityType, hasFlag: boolean = true) {
    super(entity);

    this.flagEntity = {
      data: {
        ...imagesFromState.colors[playersFromState[entity.data.owner].color]
          .flag,
        indices: {
          ...entity.data.indices,
          i: entity.data.indices.i + 1,
        },
        owner: entity.data.owner,
        position: entity.data.position,
      },
    };

    if (hasFlag) {
      this.flag = new Flag(this.flagEntity);
    }
  }

  public draw(): void {
    super.draw();

    if (this.isHovered) {
      ctx.save();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.strokeRect(
        this.renderPos.x,
        this.renderPos.y,
        this.image.width,
        this.image.height
      );
      ctx.restore();
    }
    this.flag?.draw();
  }

  public update(dt: number, cameraScroll: Position): void {
    super.update(dt, cameraScroll);
    this.flag?.update(dt, cameraScroll);
  }

  public setPosition(pos: Position): void {
    super.setPosition(pos);

    if (this.flag) {
      const flagPosition: Position = new Position(
        this.entity.data.position.x -
          this.flag.getDimension().width / 2 -
          15 +
          this.getDimension().width,
        this.entity.data.position.y -
          this.flag.getDimension().height -
          5 +
          this.getDimension().height
      );
      this.flag.setPosition(flagPosition);
    }
  }

  public setBuilding(building: EntityType) {
    this.entity.data = { ...building.data };
    this.image.src = this.entity.data.url;
  }
}
