import { Router } from "express";
import { getPublicProfile } from "../../controllers/profile/profile";

const ownerRoutes = Router();

ownerRoutes.get("/profile/:userId", getPublicProfile);

export default ownerRoutes;
