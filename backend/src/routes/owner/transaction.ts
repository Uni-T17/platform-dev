import { Router } from "express";
import { getAllTransactions } from "../../controllers/transaction/transaction";

const transactionRoutes = Router();

transactionRoutes.get("/get-all-transactions", getAllTransactions);

export default transactionRoutes;
