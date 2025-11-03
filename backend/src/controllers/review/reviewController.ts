import { Request, Response, NextFunction } from "express";
import { body, check, validationResult } from "express-validator";
import { checkModelNotExist, checkUserNotExist } from "../../utils/check";
import { getTransactionById } from "../../services/transactionService";
import { createError, errorCode } from "../../utils/error";
import { buyerCreateReview } from "../../services/reviewServices";
import { ReviewDataType } from "../../type/transactionType";

interface CustomRequest extends Request {
  userId?: number;
}

export const buyerReviewSeller = [
  body("transactionId", "Invalid transaction ID").isInt({ gt: 0 }),
  body("rating", "Rating must be between 1 and 5").isInt({ min: 1, max: 5 }),
  body("description", "Description must be at most 200 characters").isLength({
    max: 200,
  }),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(
        createError(
          `Validation Error: ${errors[0].msg}`,
          400,
          errorCode.invalid
        )
      );
    }

    // Create the review in the database
    const { transactionId, rating, description } = req.body as {
      transactionId: number;
      rating: number;
      description: string;
    };
    const userId = req.userId;
    checkUserNotExist(userId!);

    const transaction = await getTransactionById(transactionId);
    checkModelNotExist(transaction, "Transaction");

    if (transaction!.buyerId !== userId) {
      return next(
        createError(
          "Unauthorized to review this transaction",
          403,
          errorCode.unauthorised
        )
      );
    }
    if (transaction!.review) {
      return next(
        createError(
          "Review for this transaction already exists",
          400,
          errorCode.invalidRequest
        )
      );
    }

    const reviewData: ReviewDataType = {
      transactionId,
      rating,
      description,
      reviewToId: transaction!.sellerId,
      reviewById: userId!,
      transactionHistoryId: transaction!.sellerHistoryId,
    };
    const review = await buyerCreateReview(reviewData);
    const reviewId = review.id;

    res.status(201).json({ message: "Review created successfully", reviewId });
  },
];
