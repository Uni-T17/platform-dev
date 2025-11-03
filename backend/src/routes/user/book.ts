import { Router } from "express";
import { userRequestBook } from "../../controllers/request/requestController";
import {
  getPublicBooks,
  getUserBooks,
} from "../../controllers/book/bookController";

const bookRoutes = Router();

bookRoutes.post("/request-book", userRequestBook);
bookRoutes.get("/get-user-books/:ownerId", getUserBooks);
bookRoutes.get("/get-all-books", getPublicBooks);

export default bookRoutes;
