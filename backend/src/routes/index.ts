import { Router } from "express";
import authRoutes from "./authRoutes";
import ownerRoutes from "./owner/ownerRoutes";
import { auth } from "../middlewares/auth";

const routes = Router();

routes.use("/api/v1", authRoutes);
routes.use("/api/v1/owner", auth, ownerRoutes);

export default routes;
