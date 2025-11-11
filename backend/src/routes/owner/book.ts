import { Router } from "express";
import {
  getBookDetails,
  ownerCreateNewBook,
} from "../../controllers/book/bookController";
import upload from "../../middlewares/uploadFile";
import { uploadToCloudinary } from "../../middlewares/cloudinaryImageUpload";

const bookRoutes = Router();

bookRoutes.post(
  "/create-new-book",
  upload.single("book"),
  uploadToCloudinary,
  ownerCreateNewBook
);
bookRoutes.get("/get-book-details/:bookId", getBookDetails);

export default bookRoutes;
