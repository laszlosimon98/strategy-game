import { Auth } from "@/page/views/auth/auth";
import { ServerHandler } from "@/server/serverHandler";

export class Registration extends Auth {
  public constructor(title: string) {
    super(title);
  }

  public async handleAuth(): Promise<any> {
    console.log("registration");
    const data = this.getInputData();

    ServerHandler.sendMessage("auth:register", data);

    const responseData = await ServerHandler.receiveAsyncMessage(
      "auth:response"
    );

    return responseData;
  }
}
