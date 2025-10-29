import { Router } from "express";
import {
  getMyRequests,
  getRequestsForMyBook,
} from "../../controllers/request/requestController";

const requestRoutes = Router();

requestRoutes.get("/all-requests-my-books", getRequestsForMyBook);

export default requestRoutes;
