import { prisma } from ".";

export const getTransactionHistoryByUserId = async (ownerId: number) => {
  return await prisma.transactionHistory.findUnique({
    where: {
      ownerId,
    },
  });
};

export const getAllTransactionHistoryByUserId = async (ownerId: number) => {
  return await prisma.transactionHistory.findUnique({
    where: {
      ownerId,
    },
    include: {
      sellerTransactions: {
        include: { book: true, review: true, seller: true, buyer: true },
      },
      buyerTransactions: {
        include: { book: true, review: true, seller: true, buyer: true },
      },
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
