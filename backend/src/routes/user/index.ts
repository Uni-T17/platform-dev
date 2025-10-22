import { Router } from "express";
import { getPublicProfile } from "../../controllers/profile/profile";

const userRoutes = Router();

userRoutes.get("/profile/:userId", getPublicProfile);

export default userRoutes;
