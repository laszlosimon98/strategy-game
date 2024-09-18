import { Auth } from "./auth";

export class Login extends Auth {
  constructor(title: string, actionButtonImage: string) {
    super(title, actionButtonImage, new AbortController());
  }

  handleAuth = () => {
    console.log(this.nameInput.getText());
    console.log(this.passwordInput.getText());
  };
}
