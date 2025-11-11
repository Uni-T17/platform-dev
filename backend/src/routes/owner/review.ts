import { Router } from "express";
import { getMyReviews } from "../../controllers/review/reviewController";

const reviewRoutes = Router();

reviewRoutes.get("/get-all-reviews", getMyReviews);

export default reviewRoutes;
