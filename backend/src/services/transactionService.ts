import { connect } from "http2";
import { PrismaClient } from "../../generated/prisma";
import { TransactionType } from "../type/transactionType";

const prisma = new PrismaClient();

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
