import { images } from "../../../data/images";
import { selectedBuilding } from "../../../data/selectedBuilding";
import { Button } from "../../../page/components/buttonComponents/button";
import { Position } from "../../../utils/position";

export class LabelButton extends Button {
  private name: string;

  constructor(
    pos: Position,
    width: number,
    height: number,
    imageSrc: string,
    name: string
  ) {
    super(pos, width, height, imageSrc);
    this.name = name;

    this.width = images.game.buildings[name].dimensions.width;
    this.height = images.game.buildings[name].dimensions.height;
    this.setImage(images.game.buildings[name].url);

    this.pos = new Position(pos.x + this.width / 8, pos.y - this.height / 2);
  }

  draw(): void {
    super.draw();
  }

  update(mousePos: Position): void {
    super.update(mousePos);
  }

  selectBuilding(): void {
    selectedBuilding.data = images.game.buildings[this.name];
  }
}
