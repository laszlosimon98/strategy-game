import { authApi, userApi } from "@/api/api";
import { StateManager } from "@/manager/stateManager";
import { Auth } from "@/page/views/auth/auth";

export class Login extends Auth {
  public constructor(title: string) {
    super(title);
  }

  public async handleAuth(): Promise<any> {
    const data = this.getInputData();
    const response = await authApi.post("/login", data);

    if (response.data) {
      StateManager.setAccessToken(response.data.accessToken);
    }

    const user = await userApi.get("/getUser", {
      headers: {
        Authorization: `Bearer ${StateManager.getAccessToken()}`,
      },
    });

    if (user.data) {
      StateManager.setPlayerName(user.data.username);
      window.location.reload();
    }

    return response;
  }
}
