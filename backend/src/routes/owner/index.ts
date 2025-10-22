import { Router } from "express";
import {
  getCurrentUserProfile,
  updateContactInfo,
  updateOwnerProfile,
} from "../../controllers/profile/profile";

const ownerRoutes = Router();

ownerRoutes.get("/profile", getCurrentUserProfile);
ownerRoutes.put("/update-profile", updateOwnerProfile);
ownerRoutes.put("/update-contact-info", updateContactInfo);

export default ownerRoutes;
