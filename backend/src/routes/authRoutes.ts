import { Router } from "express";
import { register, verifyOtp } from "../controllers/authController";

const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/verify-otp", verifyOtp);

export default authRoutes;
