import { Auth } from "@/page/views/auth/auth";
import { ServerHandler } from "@/server/serverHandler";

export class Registration extends Auth {
  public constructor(title: string) {
    super(title);
  }

  public async handleAuth(): Promise<[boolean, string]> {
    const data = this.getInputData();
    const response: [boolean, string] = [false, ""];

    ServerHandler.sendMessage("auth:register", data);

    const responseData = await ServerHandler.receiveAsyncMessage(
      "auth:response"
    );

    if (responseData.status === 400) {
      response[0] = true;
      response[1] = responseData.message;
    }

    console.log(response);

    return response;
  }
}
