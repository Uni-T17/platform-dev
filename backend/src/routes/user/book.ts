import { Router } from "express";
import { userRequestBook } from "../../controllers/request/requestController";
import { getUserBooks } from "../../controllers/book/bookController";

const bookRoutes = Router();

bookRoutes.post("/request-book", userRequestBook);
bookRoutes.get("/get-user-books/:ownerId", getUserBooks);

export default bookRoutes;
