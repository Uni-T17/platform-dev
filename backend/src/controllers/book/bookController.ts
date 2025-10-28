import { Request, Response, NextFunction } from "express";
import { body, param, validationResult } from "express-validator";
import {
  BookDetailsResponseType,
  BookResponseType,
  Category,
  CategoryValue,
  Condition,
  ConditionValue,
  CreateBookType,
} from "../../type/bookType";
import { createError, errorCode } from "../../utils/error";
import { removeFile } from "../../utils/file";
import {
  checkBookNotExist,
  checkImageNotExist,
  checkUserNotExist,
  checkUserNotExistAndRemoveImage,
} from "../../utils/check";
import { getUserById } from "../../services/authServices";
import {
  createNewBook,
  getAllBooksByUserId,
  getBookDetailByBookId,
} from "../../services/bookServices";
import { turnDate } from "../../utils/turnDate";

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

export const getBookDetails = [
  param("bookId", "Invalid Book Id.").trim().notEmpty().isInt({ min: 1 }),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const { bookId } = req.params;
    const book = await getBookDetailByBookId(Number(bookId));
    checkBookNotExist(book);

    const resData: BookDetailsResponseType = {
      book: {
        title: book!.title,
        author: book!.author,
        isbn: book!.isbn,
        category: book!.category as Category,
        condition: book!.condition as Condition,
        description: book!.description,
        image: book!.image,
        price: book!.price,
        avaiableStatus: book!.avaiableStatus,
      },
      bookOwner: {
        ownerId: book!.ownerId,
        ownerName: book!.bookOwner.name,
        ownerRatings: book!.bookOwner.transactionHistory!.averageRating,
        isOwner: book!.ownerId === req.userId,
      },
    };

    res.status(200).json({ message: "Success", resData });
  },
];

export const getUserBooks = [
  param("ownerId", "Invalid Book Id.").trim().notEmpty().isInt({ min: 1 }),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const ownerId = Number(req.params.ownerId);

    const userId = req.userId;

    const owner = await getUserById(ownerId);
    checkUserNotExist(owner);

    const isOwner = userId! === ownerId;

    const books = await getAllBooksByUserId(ownerId);

    if (books.length === 0) {
      res
        .status(200)
        .json({ message: "Book List is empty!", isOwner, totalBook: 0 });
    }

    const booksList: BookResponseType[] = books.map((book) => {
      const date = book.createdAt;
      const dateInString = turnDate(date);
      return {
        title: book.title,
        author: book.author,
        category: book.category as Category,
        condition: book.condition as Condition,
        image: book.image,
        price: book.price,
        avaiableStatus: book.avaiableStatus,
        createdAt: dateInString,
      };
    });

    const totalBook = booksList.length;

    const resData = { message: "Success", isOwner, totalBook, booksList };

    res.status(200).json(resData);
  },
];
