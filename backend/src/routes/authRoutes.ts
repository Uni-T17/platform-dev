import { Router } from "express";
import {
  confirmPassword,
  register,
  verifyOtp,
} from "../controllers/authController";

const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/verify-otp", verifyOtp);
authRoutes.post("/confirm-password", confirmPassword);

export default authRoutes;
