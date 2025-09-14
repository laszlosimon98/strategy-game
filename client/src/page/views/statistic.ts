import { PageState } from "@/enums/pageState";
import { GameStateManager } from "@/gameStateManager/gameStateManager";
import { Button } from "@/page/components/button";
import { Page } from "@/page/views/page";
import { settings } from "@/settings";

export class Statistic extends Page {
  private backButton: Button;

  public constructor(title: string) {
    super(title);

    this.backButton = new Button(
      settings.pos.default.back,
      settings.size.button,
      "name",
      "newGame",
      () => GameStateManager.setPageState(PageState.MainMenu)
    );

    this.buttons.push(this.backButton);
  }
}
