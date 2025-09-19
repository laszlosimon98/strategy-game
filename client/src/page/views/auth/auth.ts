import { PageState } from "@/enums/pageState";
import { StateManager } from "@/manager/stateManager";
import { Button } from "@/page/components/button";
import { Text } from "@/page/components/text";
import { TextInput } from "@/page/components/textInput";
import { Page } from "@/page/views/page";
import { settings } from "@/settings";
import type { AuthType } from "@/types/auth.types";
import { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";

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
      () => StateManager.setPageState(PageState.MainMenu)
    );

    this.actionButton = new Button(
      settings.pos.default.next,
      settings.size.button,
      "name",
      title,
      this.handleNext
    );

    this.nameText = new Text(
      new Position(settings.pos.auth.name.x, settings.pos.auth.name.y - 10),
      "Felhasználó név: ",
      {
        color: settings.color.black,
      }
    );

    this.nameInput = new TextInput(
      settings.pos.auth.name,
      new Dimension(500, 40)
    );

    this.passwordText = new Text(
      new Position(
        settings.pos.auth.password.x,
        settings.pos.auth.password.y - 10
      ),
      "Jelszó: ",
      {
        color: settings.color.black,
      }
    );

    this.passwordInput = new TextInput(
      settings.pos.auth.password,
      new Dimension(500, 40),
      {
        isSecret: true,
      }
    );

    this.buttons.push(this.backButton);
    this.buttons.push(this.actionButton);
    this.inputs.push(this.nameInput);
    this.inputs.push(this.passwordInput);
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
      StateManager.setPageState(PageState.Registration);
      console.error(error);
    } else {
      StateManager.setPageState(PageState.MainMenu);
    }
  };

  public handleAuth(): [boolean, string] {
    return [false, ""];
  }
}
