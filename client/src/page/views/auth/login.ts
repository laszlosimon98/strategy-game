import { GameStateManager } from "@/gameStateManager/gameStateManager";
import { Auth } from "@/page/views/auth/auth";

export class Login extends Auth {
  public constructor(title: string) {
    super(title);
  }

  public handleAuth(): [boolean, string] {
    const { username } = this.getInputData();
    GameStateManager.setPlayerName(username);
    console.log(this.getInputData());
    return [false, ""];
  }
}
