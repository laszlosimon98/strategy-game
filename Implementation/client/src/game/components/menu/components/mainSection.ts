import { Button } from "../../../../page/components/buttonComponents/button";
import { Frame } from "../../../../page/components/frameComponets/frame";
import { MENU_ITEM_SIZE } from "../../../../settings";
import { Vector } from "../../../../utils/vector";
import { gameMenuAssets } from "../../../imports/gameMenuAssets";

export class MainSection extends Frame {
  private house: Button;
  private storage: Button;
  private population: Button;

  constructor(pos: Vector, width: number, height: number) {
    super(pos, width, height);

    this.house = new Button(
      new Vector(
        width / 6 - MENU_ITEM_SIZE.width / 2,
        pos.y - MENU_ITEM_SIZE.height / 2 + height / 2
      ),
      MENU_ITEM_SIZE.width,
      MENU_ITEM_SIZE.height,
      gameMenuAssets.house
    );

    this.storage = new Button(
      new Vector(
        width / 2 - MENU_ITEM_SIZE.width / 2,
        pos.y - MENU_ITEM_SIZE.height / 2 + height / 2
      ),
      MENU_ITEM_SIZE.width,
      MENU_ITEM_SIZE.height,
      gameMenuAssets.storage
    );

    this.population = new Button(
      new Vector(
        (width * 5) / 6 - MENU_ITEM_SIZE.width / 2,
        pos.y - MENU_ITEM_SIZE.height / 2 + height / 2
      ),
      MENU_ITEM_SIZE.width,
      MENU_ITEM_SIZE.height,
      gameMenuAssets.population
    );

    this.buttons.push(this.house);
    this.buttons.push(this.storage);
    this.buttons.push(this.population);
  }

  draw(): void {
    super.draw();
  }

  update(): void {
    this.buttons.forEach((button) => button.update());
  }
}
