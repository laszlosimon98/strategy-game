import { prismaService } from "@/prisma/prisma";
import { Response, Request } from "express";

/**
 * Lekéri a bejelentkezett felhasználó eredményeit
 * @param request Request
 * @param response Response
 * @returns
 */
export const getStatistic = async (request: Request, response: Response) => {
  const username = request["user"];

  const user = await prismaService.user.findUnique({
    omit: {
      password: true,
      refreshToken: true,
    },
    where: {
      username,
    },
    include: {
      statistic: true,
    },
  });

  if (!user) {
    return response
      .status(403)
      .send("Megtekintés csak bejelentkezett felhasználóknak!");
  }

  return response.status(200).json(user);
};

/**
 * Lekéri az 5 legjobb játékos eredményeit
 * @param request Request
 * @param response Response
 * @returns
 */
export const getTopFiveStatistic = async (
  request: Request,
  response: Response
) => {
  const users = await prismaService.user.findMany({
    include: {
      statistic: true,
    },
    omit: {
      password: true,
      refreshToken: true,
    },
    orderBy: {
      statistic: {
        wins: "desc",
      },
    },
    take: 5,
  });

  return response.status(200).json(users);
};
