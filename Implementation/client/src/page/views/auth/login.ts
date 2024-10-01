import { globalState } from "../../../data/data";
import { Auth } from "./auth";

export class Login extends Auth {
  constructor(title: string, actionButtonImage: string) {
    super(title, actionButtonImage);
  }

  handleAuth(): [boolean, string] {
    const { username } = this.getInputData();
    globalState.playerName = username;
    console.log(this.getInputData());
    return [false, ""];
  }
}
