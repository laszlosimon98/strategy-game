import { authApi } from "@/api/api";
import { Auth } from "@/page/views/auth/auth";

export class Registration extends Auth {
  public constructor(title: string) {
    super(title);
  }

  public async handleAuth(): Promise<any> {
    const data = this.getInputData();
    return await authApi.post("/register", data);
  }
}
