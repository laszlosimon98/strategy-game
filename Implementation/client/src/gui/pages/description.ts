import { globalState } from "../../data/data";
import { PageState } from "../../enums/pageState";
import { BUTTON_SIZE } from "../../settings";
import { Button } from "../components/buttonComponents/button";
import { buttonImages } from "../imports/buttons";
import { GUI } from "./gui";
import { buttonPos } from "./pos/buttonPos";

export class Description extends GUI {
  private backButton: Button;

  constructor(title: string) {
    super(title);

    this.backButton = new Button(
      buttonPos.statistic.back,
      BUTTON_SIZE.width,
      BUTTON_SIZE.height,
      buttonImages.back,
      () => (globalState.state = PageState.MainMenu)
    );

    this.buttons.push(this.backButton);
  }
}
