import { globalState } from "../../data/data";
import { PageState } from "../../states/pageState";
import { BUTTON_SIZE } from "../../settings";
import { Button } from "../components/buttonComponents/button";
import { buttonImages } from "../imports/buttons";
import { Page } from "./page";
import { buttonPos } from "./pos/buttonPos";

export class Statistic extends Page {
  private backButton: Button;

  constructor(title: string) {
    super(title);

    this.backButton = new Button(
      buttonPos.default.back,
      BUTTON_SIZE.width,
      BUTTON_SIZE.height,
      buttonImages.back,
      () => (globalState.state = PageState.MainMenu)
    );

    this.buttons.push(this.backButton);
  }
}
