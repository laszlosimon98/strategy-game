import { Auth } from "./auth";

export class Registration extends Auth {
  constructor(title: string, actionButtonImage: string) {
    super(title, actionButtonImage);
  }

  handleAuth(): [boolean, string] {
    console.log(this.getInputData());
    throw new Error("User not found");
    // throw new Error("THIS IS A BIG ERROR");
    return [true, "this is an error"];
  }
}
