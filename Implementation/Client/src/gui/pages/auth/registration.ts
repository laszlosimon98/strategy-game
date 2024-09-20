import { Auth } from "./auth";

export class Registration extends Auth {
  constructor(title: string, actionButtonImage: string) {
    super(title, actionButtonImage);
  }

  handleAuth(): [boolean, string] {
    console.log(this.getInputData());
    return [true, "this is an error"];
  }
}
