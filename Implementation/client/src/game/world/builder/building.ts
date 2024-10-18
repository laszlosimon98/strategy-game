import { MouseIntersect } from "../../../interfaces/mouseIntersect";
import { RenderInterface } from "../../../interfaces/render";
import { BuildingType } from "../../../types/gameType";
import { Position } from "../../../utils/position";
import { Entity } from "../entity";

export class Building
  extends Entity
  implements RenderInterface, MouseIntersect
{
  public constructor(building: BuildingType) {
    super(building);
  }

  public draw(): void {
    super.draw();
  }

  public update(dt: number, cameraScroll: Position): void {
    super.update(dt, cameraScroll);
  }

  public setBuilding(building: BuildingType) {
    this.entity.data = { ...building.data };
    this.image.src = this.entity.data.url;
  }

  public getBuilding(): BuildingType {
    return this.entity;
  }

  public getBuildingName(): string | undefined {
    if (this.entity.data.url) {
      return this.entity.data.url.split("/")[6].split(".")[0];
    }
  }
}
