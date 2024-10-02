import { globalState } from "../../../data/data";
import { Button } from "../../../page/components/buttonComponents/button";
import { Frame } from "../../../page/components/frameComponets/frame";
import { MENU_ITEM_SIZE } from "../../../settings";
import { Vector } from "../../../utils/vector";
import { gameMenuAssets } from "../../imports/gameMenuAssets";

export class MainSection {
  private mainSection: Frame;
  private house: Button;
  private storage: Button;
  private population: Button;

  private buttons: Button[] = [];

  constructor(pos: Vector, width: number, height: number) {
    this.mainSection = new Frame(pos, width, height);

    this.house = new Button(
      new Vector(
        width / 6 - MENU_ITEM_SIZE.width / 2,
        pos.y - MENU_ITEM_SIZE.height / 2 + height / 2
      ),
      MENU_ITEM_SIZE.width,
      MENU_ITEM_SIZE.height,
      gameMenuAssets.other
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
        width / 2 + width / 3 - MENU_ITEM_SIZE.width / 2,
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
    this.mainSection.draw();

    this.buttons.forEach((button) => button.draw());
  }

  update(): void {
    this.buttons.forEach((button) => button.update());
  }

  handleClick(): void {
    const { x, y } = globalState.mousePos;
    this.resetButtonImage();

    this.buttons.forEach((button) => {
      if (button.isClicked(x, y)) {
        const image: string = button.getImage().split("/")[7].split(".")[0];
        const select = `${image}_selected`;
        console.log(select);
        button.setImage(gameMenuAssets[select]);
      }
    });
  }

  private resetButtonImage(): void {
    this.buttons.forEach((button) => {
      let image: string = button.getImage().split("/")[7].split(".")[0];

      if (image.includes("_selected")) {
        image = image.split("_")[0];
      }

      const select = `${image}`;
      console.warn(select);
      button.setImage(gameMenuAssets[select]);
    });
  }
}
