import { Router } from "express";
import {
  getMyRequests,
  userUpdateRequest,
} from "../../controllers/request/requestController";

const requestRoutes = Router();

requestRoutes.get("/all-requests", getMyRequests);
requestRoutes.put("/update-request", userUpdateRequest);

export default requestRoutes;
