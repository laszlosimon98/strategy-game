import { state } from "../../../data/state";
import { Button } from "../../../page/components/buttonComponents/button";
import { Dimension } from "../../../utils/dimension";
import { Position } from "../../../utils/position";

export class LabelButton extends Button {
  private name: string;

  constructor(pos: Position, dim: Dimension, imageSrc: string, name: string) {
    super(pos, dim, imageSrc);
    this.name = name;

    this.dim.width = state.images.game.buildings[name].dimensions.width;
    this.dim.height = state.images.game.buildings[name].dimensions.height;
    this.setImage(state.images.game.buildings[name].url);

    this.pos = new Position(
      pos.x + this.dim.width / 8,
      pos.y - this.dim.height / 2
    );
  }

  draw(): void {
    super.draw();
  }

  update(dt: number, mousePos: Position): void {
    super.update(dt, mousePos);
  }

  selectBuilding(): void {
    state.building.selected.data = state.images.game.buildings[this.name];
  }
}
