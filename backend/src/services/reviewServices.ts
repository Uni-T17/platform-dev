import { prisma } from ".";
import { ReviewDataType } from "../type/transactionType";

export const buyerCreateReview = async (reviewData: ReviewDataType) => {
  let data: any = {
    rating: reviewData.rating,
    description: reviewData.description,
    transactionId: reviewData.transactionId,
    reviewToId: reviewData.reviewToId,
    reviewById: reviewData.reviewById,
    transactionHistoryId: reviewData.transactionHistoryId,
  };
  return await prisma.review.create({
    data,
  });
};

export const getReviewsByUserId = async (userId: number) => {
  return await prisma.review.findMany({
    where: {
      reviewToId: userId,
    },
    include: {
      transaction: {
        include: {
          book: {
            select: {
              title: true,
            },
          },
          buyer: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
};
