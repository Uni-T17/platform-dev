import { Router } from "express";
import { getCurrentUserProfile } from "../../controllers/user/profile";

const ownerRoutes = Router();

ownerRoutes.get("/profile", getCurrentUserProfile);

export default ownerRoutes;
