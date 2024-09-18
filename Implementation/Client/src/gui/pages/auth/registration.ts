import { Auth } from "./auth";

export class Registration extends Auth {
  constructor(title: string, actionButtonImage: string) {
    super(title, actionButtonImage, new AbortController());
  }

  handleAuth = () => {
    console.log(this.getInputData());
  };
}
