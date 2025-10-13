import { Router } from "express";
import authRoutes from "./authRoutes";

const routes = Router();

routes.use("/api/v1", authRoutes);

export default routes;
