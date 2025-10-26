import { Router } from "express";
import { getMyRequests } from "../../controllers/request/requestController";

const requestRoutes = Router();

requestRoutes.get("/all-requests", getMyRequests);

export default requestRoutes;
