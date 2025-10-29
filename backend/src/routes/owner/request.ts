import { Router } from "express";
import {
  approveOrRejectRequest,
  getMyRequests,
  getRequestsForMyBook,
} from "../../controllers/request/requestController";

const requestRoutes = Router();

requestRoutes.get("/all-requests-my-books", getRequestsForMyBook);
requestRoutes.put("/update-request", approveOrRejectRequest);

export default requestRoutes;
