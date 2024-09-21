import { Auth } from "./auth";

export class Login extends Auth {
  constructor(title: string, actionButtonImage: string) {
    super(title, actionButtonImage);
  }

  handleAuth(): [boolean, string] {
    console.log(this.getInputData());
    return [false, ""];
  }
}
