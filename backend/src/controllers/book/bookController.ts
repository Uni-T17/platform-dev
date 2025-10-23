import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import {
  CategoryValue,
  ConditionValue,
  CreateBookType,
} from "../../type/bookType";
import { createError, errorCode } from "../../utils/error";
import { removeFile } from "../../utils/file";
import {
  checkImageNotExist,
  checkUserNotExistAndRemoveImage,
} from "../../utils/check";
import { getUserById } from "../../services/authServices";
import {
  createNewBook,
  getBookCountByOwnerId,
} from "../../services/bookServices";

interface CustomRequest extends Request {
  userId?: number;
  file?: Express.Multer.File;
}

export const ownerCreateNewBook = [
  body("title", "Invalid Title.")
    .trim()
    .notEmpty()
    .isLength({ max: 100 })
    .escape()
    .withMessage("Title can't be coding words!"),
  body("isbn", "Invalid isbn").optional().isLength({ max: 50 }).escape(),
  body("author", "Invalid Author.")
    .trim()
    .notEmpty()
    .isLength({ max: 100 })
    .escape()
    .withMessage("Author Name can't be coding words!"),
  body("category", "Invalid category").isIn(CategoryValue),
  body("condition", "Invalid Condition").isIn(ConditionValue),
  body("description", "Invalid description")
    .optional()
    .isLength({ max: 100 })
    .escape(),
  body("price", "Invalid price").trim().notEmpty().isInt({ min: 1, max: 10 }),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      await removeFile(req.file!.filename);
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const image = req.file;
    checkImageNotExist(image);
    const userId = req.userId;
    const user = await getUserById(userId!);
    await checkUserNotExistAndRemoveImage(user, image!.filename);
    const { title, author, isbn, category, condition, description, price } =
      req.body;

    const bookData: CreateBookType = {
      title: title,
      author: author,
      isbn: isbn,
      category: category,
      condition: condition,
      image: image!.filename,
      description: description,
      price: Number(price),
      ownerId: user!.id,
    };

    const book = await createNewBook(bookData);
    const resData = {
      message: "Successfully created a new book.",
      bookId: book.id,
    };

    res.status(200).json(resData);
  },
];
