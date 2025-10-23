import { Router } from "express";
import { createNewBook } from "../../controllers/book/bookController";
import upload from "../../middlewares/uploadFile";

const bookRoutes = Router();

bookRoutes.post("/create-new-book", upload.single("book"), createNewBook);

export default bookRoutes;
