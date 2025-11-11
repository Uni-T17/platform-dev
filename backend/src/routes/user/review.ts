import { Router } from "express";
import {
  buyerReviewSeller,
  getAllReviews,
} from "../../controllers/review/reviewController";

const reviewRoutes = Router();

reviewRoutes.post("/create-review", buyerReviewSeller);
reviewRoutes.get("/get-all-reviews/:userId", getAllReviews);

export default reviewRoutes;
