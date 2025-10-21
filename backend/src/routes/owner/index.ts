import { Router } from "express";
import { getCurrentUserProfile } from "../../controllers/profile/profile";

const ownerRoutes = Router();

ownerRoutes.get("/profile", getCurrentUserProfile);

export default ownerRoutes;
