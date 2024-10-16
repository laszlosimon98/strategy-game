import { ctx } from "../../init";
import { Indices } from "../../utils/indices";
import { BuildingType } from "../types/types";
import { Building } from "./building";

export class FakeBuilding extends Building {
  public constructor(indices: Indices, building: BuildingType) {
    super(indices, building);
  }

  draw(): void {
    ctx.save();
    ctx.globalAlpha = 0.75;
    super.draw();
    ctx.restore();
  }
}
