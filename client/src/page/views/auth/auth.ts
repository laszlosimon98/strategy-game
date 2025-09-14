import { PageState } from "@/enums/pageState";
import { GameStateManager } from "@/gameStateManager/gameStateManager";
import { Button } from "@/page/components/button";
import { Text } from "@/page/components/text";
import { TextInput } from "@/page/components/textInput";
import { Page } from "@/page/views/page";
import { settings } from "@/settings";
import type { AuthType } from "@/types/auth.types";
import { Dimension } from "@/utils/dimension";

export class Auth extends Page {
  protected backButton: Button;
  protected actionButton: Button;

  private nameInput: TextInput;
  private passwordInput: TextInput;

  private nameText: Text;
  private passwordText: Text;

  public constructor(title: string) {
    super(title);

    this.backButton = new Button(
      settings.pos.default.back,
      settings.size.button,
      "name",
      "back",
      () => GameStateManager.setPageState(PageState.MainMenu)
    );

    this.actionButton = new Button(
      settings.pos.default.next,
      settings.size.button,
      "name",
      title,
      this.handleNext
    );

    this.nameInput = new TextInput(
      settings.pos.auth.name,
      new Dimension(500, 40),
      "",
      settings.color.inputBackground,
      false
    );

    this.passwordInput = new TextInput(
      settings.pos.auth.password,
      new Dimension(500, 40),
      "",
      settings.color.inputBackground,
      true
    );

    this.buttons.push(this.backButton);
    this.buttons.push(this.actionButton);
    this.inputs.push(this.nameInput);
    this.inputs.push(this.passwordInput);

    this.nameText = new Text(
      settings.pos.auth.name,
      new Dimension(0, -40),
      "Felhasználó név: ",
      false,
      settings.color.black
    );

    this.passwordText = new Text(
      settings.pos.auth.password,
      new Dimension(0, -40),
      "Jelszó: ",
      false,
      settings.color.black
    );
  }

  public draw(): void {
    super.draw();
    this.nameInput.draw();
    this.passwordInput.draw();
    this.nameText.draw();
    this.passwordText.draw();
  }

  protected getInputData(): AuthType {
    return {
      username: this.nameInput.getText(),
      password: this.passwordInput.getText(),
    };
  }

  public handleNext = (): void => {
    const [isError, error] = this.handleAuth();

    if (isError) {
      GameStateManager.setPageState(PageState.Registration);
      console.error(error);
    } else {
      GameStateManager.setPageState(PageState.MainMenu);
    }
  };

  public handleAuth(): [boolean, string] {
    return [false, ""];
  }
}
