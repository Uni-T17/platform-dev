import { Router } from "express";
import {
  getCurrentUserProfile,
  updateContactInfo,
  updateOwnerProfile,
} from "../../controllers/profile/profile";
import bookRoutes from "./book";

const ownerRoutes = Router();

ownerRoutes.get("/profile", getCurrentUserProfile);
ownerRoutes.put("/update-profile", updateOwnerProfile);
ownerRoutes.put("/update-contact-info", updateContactInfo);

ownerRoutes.use("/books", bookRoutes);

export default ownerRoutes;
