import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export const getTransactionHistoryByUserId = async (ownerId: number) => {
  return await prisma.transactionHistory.findUnique({
    where: {
      ownerId,
    },
  });
};

export const updateTransactionHistoryByUserId = async (
  ownerId: number,
  updateData: any
) => {
  return await prisma.transactionHistory.update({
    where: {
      ownerId,
    },
    data: updateData,
  });
};
