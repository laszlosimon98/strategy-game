import { authApi } from "@/api/api";
import { Auth } from "@/page/views/auth/auth";

export class Login extends Auth {
  public constructor(title: string) {
    super(title);
  }

  public async handleAuth(): Promise<any> {
    const data = this.getInputData();
    return authApi.post("/login", data);
  }
}
