import { Router } from "express";
import {
  getMyRequests,
  userRequestAgain,
  userUpdateRequest,
} from "../../controllers/request/requestController";
import { RequestedStatus } from "../../type/statusType";

const requestRoutes = Router();

requestRoutes.get("/pending", (req, res, next) =>
  getMyRequests(req, res, next, RequestedStatus.PENDING)
);
requestRoutes.get("/approve", (req, res, next) =>
  getMyRequests(req, res, next, RequestedStatus.APPROVE)
);
requestRoutes.get("/reject", (req, res, next) =>
  getMyRequests(req, res, next, RequestedStatus.REJECT)
);
requestRoutes.put("/update-request", userUpdateRequest);
requestRoutes.put("/request-again", userRequestAgain);

export default requestRoutes;
