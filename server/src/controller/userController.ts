import { prismaService } from "@/prisma/prisma";
import { Response, Request } from "express";

export const handleUser = async (request: Request, response: Response) => {
  const username = request["user"];

  const user = await prismaService.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    return response
      .status(403)
      .send("Megtekintés csak bejelentkezett felhasználóknak!");
  }

  return response.status(200).json({ username: user.username });
};
