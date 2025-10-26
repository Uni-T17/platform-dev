import { Router } from "express";
import { getPublicProfile } from "../../controllers/profile/profile";
import bookRoutes from "./book";
import requestRoutes from "./request";

const userRoutes = Router();

userRoutes.get("/profile/:userId", getPublicProfile);
userRoutes.use("/books", bookRoutes);
userRoutes.use("/requests", requestRoutes);

export default userRoutes;
