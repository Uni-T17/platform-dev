import { Router } from "express";
import { buyerReviewSeller } from "../../controllers/review/reviewController";

const reviewRoutes = Router();

reviewRoutes.post("/create-review", buyerReviewSeller);

export default reviewRoutes;
