import { Router } from "express";
import {
  approveOrRejectRequest,
  getIncomingRequests,
} from "../../controllers/request/requestController";

const requestRoutes = Router();

requestRoutes.get("/incoming-requests", getIncomingRequests);
requestRoutes.put("/update-request", approveOrRejectRequest);

export default requestRoutes;
