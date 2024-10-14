import { globalState } from "../../data/data";
import { PageState } from "../../states/pageState";
import { BUTTON_SIZE } from "../../settings";
import { Button } from "../components/buttonComponents/button";
import { Page } from "./page";
import { buttonPos } from "./pos/buttonPos";
import { images } from "../../data/images";

export class Statistic extends Page {
  private backButton: Button;

  public constructor(title: string) {
    super(title);

    this.backButton = new Button(
      buttonPos.default.back,
      BUTTON_SIZE.width,
      BUTTON_SIZE.height,
      images.page.buttons.back.url,
      () => (globalState.state = PageState.MainMenu)
    );

    this.buttons.push(this.backButton);
  }
}
