import { Request, Response, NextFunction } from "express";
import { body, param, validationResult } from "express-validator";
import {
  BookDetailsType,
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
  getBookCountByOwnerId,
  getBookDetailByBookId,
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
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    // You no longer have a disk file; just ensure an image was sent if required
    // If optional, you can skip this check
    if (!req.file) {
      return next(createError("Image is required", 400, errorCode.invalid));
    }

    const user = await getUserById(req.userId!);
    if (!user)
      return next(createError("User not found", 404, errorCode.invalid));

    // Cloudinary info from middleware
    const cld = (req as any).cloudinary; // { url, publicId, ... }
    if (!cld?.url)
      return next(createError("Upload failed", 500, errorCode.invalid));

    const { title, author, isbn, category, condition, description, price } =
      req.body;

    // ⚠️ Adjust to your Prisma schema: either keep 'image' as URL or add 'imageUrl'/'imagePublicId'
    const book = await createNewBook({
      title,
      author,
      isbn,
      category,
      condition,
      image: cld.url, // store URL instead of filename  // add this field if you want deletions later
      description,
      price: Number(price),
      ownerId: user.id,
    });

    res.status(201).json({
      message: "Successfully created a new book.",
      bookId: book.id,
      imageUrl: cld.url,
    });
  },
];

export const getBookDetails = [
  param("bookId", "Invalid Book Id.").notEmpty().isInt({ min: 1 }),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const { bookId } = req.params;
    const book = await getBookDetailByBookId(Number(bookId));
    checkBookNotExist(book);

    const resData: BookDetailsType = {
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
