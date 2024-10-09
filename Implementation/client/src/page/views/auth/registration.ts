import { Auth } from "./auth";

export class Registration extends Auth {
  public constructor(title: string, actionButtonImage: string) {
    super(title, actionButtonImage);
  }

  public handleAuth(): [boolean, string] {
    console.log(this.getInputData());
    return [true, "this is an error"];
  }
}
