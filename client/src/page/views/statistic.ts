import { state } from "@/data/state";
import { PageState } from "@/enums/pageState";
import { Button } from "@/page/components/button";
import { Page } from "@/page/views/page";
import { buttonPos } from "@/page/views/pos/buttonPos";
import { settings } from "@/settings";

export class Statistic extends Page {
  private backButton: Button;

  public constructor(title: string) {
    super(title);

    this.backButton = new Button(
      buttonPos.default.back,
      settings.size.button,
      "name",
      "newGame",
      () => (state.navigation.pageState = PageState.MainMenu)
    );

    this.buttons.push(this.backButton);
  }
}
