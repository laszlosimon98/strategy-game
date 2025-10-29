import { Auth } from "@/page/views/auth/auth";
import { ServerHandler } from "@/server/serverHandler";
import { SERVER_URL, settings } from "@/settings";
import axios from "axios";

export class Registration extends Auth {
  public constructor(title: string) {
    super(title);
  }

  public async handleAuth(): Promise<any> {
    const data = this.getInputData();
    const responseData = await axios.post(
      `${SERVER_URL}/auth/register`,
      data,
      {}
    );

    console.log(responseData);

    // ServerHandler.sendMessage("auth:register", data);

    // const responseData = await ServerHandler.receiveAsyncMessage(
    //   "auth:response"
    // );

    return responseData;
  }
}
