import { Request, Response, NextFunction } from "express";
import { getCreditsByOwnerId } from "../../services/creditsServices";
import { checkModelNotExist } from "../../utils/check";
import { getTransactionHistoryByUserId } from "../../services/transactionHistoryService";

interface CustomRequest extends Request {
  userId?: number;
}

export const getMyCredits = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = Number(req.userId);

  // Fetch credits for the user from the database
  const credits = await getCreditsByOwnerId(userId);
  checkModelNotExist(credits, "Credit");

  const balance = credits!.balance;

  const transactionHistory = await getTransactionHistoryByUserId(userId);
  checkModelNotExist(transactionHistory, "TransactionHistory");

  const resData = {
    balance: balance,
    totalEarned: transactionHistory!.totalIncome,
    totalSpent: transactionHistory!.totalOutcome,
    exchanges: transactionHistory!.transactionCount,
    rating: transactionHistory!.averageRating,
  };

  res.status(200).json({
    message: "All credits retrieved successfully",
    data: resData,
  });
};
