import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export const getBookCountByOwnerId = async (ownerId: number) => {
  return await prisma.book.count({
    where: { ownerId },
  });
};
