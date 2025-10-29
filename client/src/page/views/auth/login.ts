import { Auth } from "@/page/views/auth/auth";
import { ServerHandler } from "@/server/serverHandler";

export class Login extends Auth {
  public constructor(title: string) {
    super(title);
  }

  public async handleAuth(): Promise<any> {
    console.log("login");
    const data = this.getInputData();

    ServerHandler.sendMessage("auth:login", data);

    const responseData = await ServerHandler.receiveAsyncMessage(
      "auth:response"
    );

    return responseData;
  }
}
