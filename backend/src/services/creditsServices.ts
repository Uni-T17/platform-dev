import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export const getCreditsByOwnerId = async (userId: number) => {
  return await prisma.credits.findUnique({
    where: {
      userId,
    },
  });
};
