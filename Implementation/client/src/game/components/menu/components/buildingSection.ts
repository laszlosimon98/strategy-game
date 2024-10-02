import { globalState } from "../../../../data/data";
import { Button } from "../../../../page/components/buttonComponents/button";
import { Frame } from "../../../../page/components/frameComponets/frame";
import { MENU_ITEM_SIZE } from "../../../../settings";
import { GameSubMenuState } from "../../../../states/gameMenuState";
import { Vector } from "../../../../utils/vector";
import { gameMenuAssets } from "../../../imports/gameMenuAssets";
import { FoodSection } from "./subComponents/foodSection";
import { MilitarySection } from "./subComponents/militarySection";
import { ResourceSection } from "./subComponents/resourceSection";
import { StorageSection } from "./subComponents/storageSection";

export class BuildingSection extends Frame {
  private resources: Button;
  private food: Button;
  private military: Button;
  private storage: Button;

  private readonly margin: number = 125;

  private subFrames: Partial<Record<GameSubMenuState, Frame>>;

  constructor(pos: Vector, width: number, height: number) {
    super(pos, width, height);

    this.subFrames = {
      [GameSubMenuState.Resources]: new ResourceSection(
        new Vector(pos.x, pos.y + this.margin),
        width,
        height - this.margin
      ),
      [GameSubMenuState.Food]: new FoodSection(
        new Vector(pos.x, pos.y + this.margin),
        width,
        height - this.margin
      ),
      [GameSubMenuState.Military]: new MilitarySection(
        new Vector(pos.x, pos.y + this.margin),
        width,
        height - this.margin
      ),
      [GameSubMenuState.Other]: new StorageSection(
        new Vector(pos.x, pos.y + this.margin),
        width,
        height - this.margin
      ),
    };

    this.resources = new Button(
      new Vector(width / 8 - MENU_ITEM_SIZE.width / 2, pos.y + 5),
      MENU_ITEM_SIZE.width,
      MENU_ITEM_SIZE.height,
      gameMenuAssets.resource
    );

    this.food = new Button(
      new Vector((width * 3) / 8 - MENU_ITEM_SIZE.width / 2, pos.y + 5),
      MENU_ITEM_SIZE.width,
      MENU_ITEM_SIZE.height,
      gameMenuAssets.food
    );

    this.military = new Button(
      new Vector((width * 5) / 8 - MENU_ITEM_SIZE.width / 2, pos.y + 5),
      MENU_ITEM_SIZE.width,
      MENU_ITEM_SIZE.height,
      gameMenuAssets.military
    );

    this.storage = new Button(
      new Vector((width * 7) / 8 - MENU_ITEM_SIZE.width / 2, pos.y + 5),
      MENU_ITEM_SIZE.width,
      MENU_ITEM_SIZE.height,
      gameMenuAssets.house
    );

    this.buttons.push(this.resources);
    this.buttons.push(this.food);
    this.buttons.push(this.military);
    this.buttons.push(this.storage);
  }

  draw(): void {
    super.draw();

    this.subFrames[globalState.subMenuState]?.draw();
  }

  update(): void {
    this.buttons.forEach((btn) => btn.update());
  }
}
