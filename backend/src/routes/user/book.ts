import { Router } from "express";
import { userRequestBook } from "../../controllers/request/requestController";
import {
  getBookDetails,
  getPublicBooks,
  getUserBooks,
} from "../../controllers/book/bookController";

const bookRoutes = Router();

bookRoutes.post("/request-book", userRequestBook);
bookRoutes.get("/get-user-books/:ownerId", getUserBooks);
bookRoutes.get("/get-all-books", getPublicBooks);
bookRoutes.get("/get-book-details/:bookId", getBookDetails);

export default bookRoutes;
