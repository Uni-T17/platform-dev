import { Router } from "express";
import { getPublicProfile } from "../../controllers/profile/profile";
import bookRoutes from "./book";

const userRoutes = Router();

userRoutes.get("/profile/:userId", getPublicProfile);
userRoutes.use("/books", bookRoutes);

export default userRoutes;
