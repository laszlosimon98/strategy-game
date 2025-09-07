import { state } from "@/data/state";
import { Auth } from "@/page/views/auth/auth";

export class Login extends Auth {
  public constructor(title: string) {
    super(title);
  }

  public handleAuth(): [boolean, string] {
    const { username } = this.getInputData();
    state.player.name = username;
    console.log(this.getInputData());
    return [false, ""];
  }
}
