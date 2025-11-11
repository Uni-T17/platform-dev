import { Router } from "express";
import { getMyCredits } from "../../controllers/credits/creditController";

const creditsRoutes = Router();

creditsRoutes.get("/get-credits", getMyCredits);

export default creditsRoutes;
