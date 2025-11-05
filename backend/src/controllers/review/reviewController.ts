import { Request, Response, NextFunction } from "express";
import { body, check, param, validationResult } from "express-validator";
import { checkModelNotExist, checkUserNotExist } from "../../utils/check";
import { getTransactionById } from "../../services/transactionService";
import { createError, errorCode } from "../../utils/error";
import {
  buyerCreateReview,
  getReviewsByUserId,
} from "../../services/reviewServices";
import { ReviewDataType } from "../../type/transactionType";
import { updateTransactionHistoryByUserId } from "../../services/transactionHistoryService";
import { getUserById } from "../../services/authServices";
import { ReviewType } from "../../type/reviewType";
import { turnDate } from "../../utils/turnDate";

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

    // Update seller's transaction history with new average rating and review count
    await updateTransactionHistoryByUserId(transaction!.sellerHistoryId, {
      averageRating: { increment: rating },
    });
    const reviewId = review.id;

    res.status(201).json({ message: "Review created successfully", reviewId });
  },
];

export const getAllReviews = [
  param("userId", "Invalid UserId")
    .trim()
    .notEmpty()
    .isInt({ min: 1 })
    .escape(),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }
    const userId = Number(req.params.userId);
    const user = await getUserById(userId!);
    checkUserNotExist(user);
    const reviews = await getReviewsByUserId(user!.id);
    checkModelNotExist(reviews, "Reviews");

    if (reviews.length === 0) {
      return res
        .status(200)
        .json({ message: "No reviews found for this user", reviews: [] });
    }

    const reviewsList: ReviewType[] = reviews.map((review) => {
      const date = review.createdAt;
      const createdAt = turnDate(date);
      return {
        id: review.id,
        rating: review.rating,
        description: review.description,
        bookName: review.transaction.book.title,
        reviewBy: review.transaction.buyer.name,
        createdAt: createdAt,
      };
    });

    const resData = {
      message: "Reviews retrieved successfully",
      reviews: reviewsList,
    };
    res.status(200).json(resData);
  },
];

export const getMyReviews = [
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }
    const userId = req.userId;
    const user = await getUserById(userId!);
    checkUserNotExist(user);
    const reviews = await getReviewsByUserId(user!.id);
    checkModelNotExist(reviews, "Reviews");

    if (reviews.length === 0) {
      return res
        .status(200)
        .json({ message: "No reviews found for this user", reviews: [] });
    }

    const reviewsList: ReviewType[] = reviews.map((review) => {
      const date = review.createdAt;
      const createdAt = turnDate(date);
      return {
        id: review.id,
        rating: review.rating,
        description: review.description,
        bookName: review.transaction.book.title,
        reviewBy: review.transaction.buyer.name,
        createdAt: createdAt,
      };
    });

    const resData = {
      message: "Reviews retrieved successfully",
      reviews: reviewsList,
    };
    res.status(200).json(resData);
  },
];
