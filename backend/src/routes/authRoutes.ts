import { Router } from "express";
import {
  confirmPassword,
  login,
  register,
  verifyOtp,
} from "../controllers/authController";

const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/verify-otp", verifyOtp);
authRoutes.post("/confirm-password", confirmPassword);
authRoutes.post("/login", login);

export default authRoutes;
