import { Router } from "express";
import { getPublicBooks } from "../controllers/book/bookController";

const publicRoutes = Router();

publicRoutes.get("/books", getPublicBooks);

export default publicRoutes;
