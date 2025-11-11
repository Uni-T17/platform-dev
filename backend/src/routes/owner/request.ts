import { Router } from "express";
import {
  approveOrRejectRequest,
  getIncomingRequests,
} from "../../controllers/request/requestController";
import { RequestedStatus } from "../../type/statusType";

const requestRoutes = Router();

requestRoutes.get("/incoming-pending", (req, res, next) =>
  getIncomingRequests(req, res, next, RequestedStatus.PENDING)
);
requestRoutes.get("/incoming-approve", (req, res, next) =>
  getIncomingRequests(req, res, next, RequestedStatus.APPROVE)
);

requestRoutes.put("/update-request", approveOrRejectRequest);

export default requestRoutes;
