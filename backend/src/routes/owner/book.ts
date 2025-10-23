import { Router } from "express";
import { ownerCreateNewBook } from "../../controllers/book/bookController";
import upload from "../../middlewares/uploadFile";

const bookRoutes = Router();

bookRoutes.post("/create-new-book", upload.single("book"), ownerCreateNewBook);

export default bookRoutes;
