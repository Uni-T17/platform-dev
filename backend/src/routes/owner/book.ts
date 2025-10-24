import { Router } from "express";
import {
  getBookDetails,
  ownerCreateNewBook,
} from "../../controllers/book/bookController";
import upload from "../../middlewares/uploadFile";

const bookRoutes = Router();

bookRoutes.post("/create-new-book", upload.single("book"), ownerCreateNewBook);
bookRoutes.get("/get-book-details/:bookId", getBookDetails);

export default bookRoutes;
