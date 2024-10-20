import { Auth } from "./auth";

export class Registration extends Auth {
  public constructor(title: string) {
    super(title);
  }

  public handleAuth(): [boolean, string] {
    console.log(this.getInputData());
    return [true, "this is an error"];
  }
}
