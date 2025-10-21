import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export const getTransactionHistoryByUserId = async (ownerId: number) => {
  return await prisma.transactionHistory.findUnique({
    where: {
      ownerId,
    },
  });
};
