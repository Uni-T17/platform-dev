import { Request, Response, NextFunction } from "express";
import { getAllTransactionHistoryByUserId } from "../../services/transactionHistoryService";
import { checkModelNotExist } from "../../utils/check";
import { CompleteTransactionType } from "../../type/transactionType";
import { turnDate } from "../../utils/turnDate";

interface CustomRequest extends Request {
  userId?: number;
}

export const getAllTransactions = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = Number(req.userId);

  // Fetch transactions for the user from the database
  const transactionHistory = await getAllTransactionHistoryByUserId(userId);
  checkModelNotExist(transactionHistory, "Transaction");

  const transactions = transactionHistory!.sellerTransactions.concat(
    transactionHistory!.buyerTransactions
  );
  if (transactions.length === 0) {
    return res.status(200).json({ message: "No transactions found", data: [] });
  }

  const resData: CompleteTransactionType[] = transactions.map((transaction) => {
    const date = transaction.createdAt;
    const completedAt = turnDate(date);

    return {
      transactionId: transaction.id,
      bookName: transaction.book.title,
      authorName: transaction.book.author,
      givenTo: transaction.buyer.name,
      price: transaction.price,
      recievedFrom: transaction.seller.name,
      completedAt: completedAt,
      isOwner: transaction.sellerId === userId,
      review: transaction.review ? transaction.review.description : null,
    };
  });

  res
    .status(200)
    .json({
      message: "All transactions retrieved successfully",
      data: resData,
    });
};
