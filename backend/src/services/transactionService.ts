import { prisma } from ".";
import { TransactionType } from "../type/transactionType";

export const createNewTransaction = async (
  transactionData: TransactionType
) => {
  let data: any = {
    price: transactionData.price,
    requestedBookId: transactionData.requestedBookId,
    bookId: transactionData.bookId,
    sellerId: transactionData.sellerId,
    buyerId: transactionData.buyerId,
    sellerHistoryId: transactionData.sellerHistoryId,
    buyerHistoryId: transactionData.buyerHistoryId,
  };
  return await prisma.transaction.create({
    data,
  });
};

export const getTransactionById = async (transactionId: number) => {
  return await prisma.transaction.findUnique({
    where: {
      id: transactionId,
    },
    include: {
      review: true,
    },
  });
};
