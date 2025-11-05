import { Router } from "express";
import {
  getCurrentUserProfile,
  updateContactInfo,
  updateOwnerProfile,
} from "../../controllers/profile/profile";
import bookRoutes from "./book";
import requestRoutes from "./request";
import transactionRoutes from "./transaction";
import creditsRoutes from "./credits";
import reviewRoutes from "./review";

const ownerRoutes = Router();

ownerRoutes.get("/profile", getCurrentUserProfile);
ownerRoutes.put("/update-profile", updateOwnerProfile);
ownerRoutes.put("/update-contact-info", updateContactInfo);

ownerRoutes.use("/books", bookRoutes);

ownerRoutes.use("/requests", requestRoutes);

ownerRoutes.use("/transactions", transactionRoutes);

ownerRoutes.use("/credits", creditsRoutes);

ownerRoutes.use("/reviews", reviewRoutes);

export default ownerRoutes;
