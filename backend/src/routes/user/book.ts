import { Router } from "express";
import { userRequestBook } from "../../controllers/request/requestController";

const bookRoutes = Router();

bookRoutes.post("/request-book", userRequestBook);

export default bookRoutes;
