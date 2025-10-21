import { Router } from "express";
import authRoutes from "./authRoutes";
import ownerRoutes from "./owner";
import userRoutes from "./user";
import { auth } from "../middlewares/auth";

const routes = Router();

routes.use("/api/v1", authRoutes);
routes.use("/api/v1/owner", auth, ownerRoutes);
routes.use("/api/v1/user", auth, userRoutes);

export default routes;
