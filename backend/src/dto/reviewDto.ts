import { Review } from "../../generated/prisma";

export class ReviewDto {
  id: number;
  description: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
  reviewToId: number;
  reviewById: number;
  transactionId: number;
  transactionHistoryId: number;

  constructor(review: Review) {
    this.id = review.id;
    this.description = review.description;
    this.rating = review.rating;
    this.createdAt = review.createdAt;
    this.updatedAt = review.updatedAt;
    this.reviewToId = review.reviewToId;
    this.reviewById = review.reviewById;
    this.transactionId = review.transactionId;
    this.transactionHistoryId = review.transactionHistoryId;
  }
}
