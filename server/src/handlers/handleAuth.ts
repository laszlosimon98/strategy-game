import { PrismaClient } from "@prisma/client";

export const handleAuth = () => {
  const prismaClient = new PrismaClient();

  const login = async () => {
    const count = await prismaClient.user.count();
    console.log(count);
  };

  login();
};

handleAuth();
