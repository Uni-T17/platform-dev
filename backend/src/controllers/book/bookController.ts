import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { CategoryValue, ConditionValue } from "../../type/bookType";
import { createError, errorCode } from "../../utils/error";
import { removeFile } from "../../utils/file";

interface CustomRequest extends Request {
  userId?: number;
  file?: any;
}

//   id Int @id @default(autoincrement())
//   title String @db.VarChar(225)
//   author String @db.VarChar(100)
//   isbn String? @db.VarChar(225)
//   category Category @default(NONE)
//   condition Condition
//   description String? @db.VarChar(225)
//   image String @db.VarChar(225)
//   price Int
//   avaiableStatus Boolean @default(true)
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt

//   bookOwner User @relation(fields: [ownerId],references: [id],onDelete: Cascade,onUpdate: Cascade)
//   ownerId Int

//   // bookList BookList @relation(fields: [bookListId],references: [id],onDelete: Cascade, onUpdate: Cascade)
//   // bookListId Int

//   requestedBooks RequestedBook[]
//   transaction Transaction?

export const createNewBook = [
  body("title", "Invalid Title.")
    .trim()
    .notEmpty()
    .isLength({ max: 100 })
    .escape(),
  body("isbn", "Invalid isbn").optional().isLength({ max: 50 }).escape(),
  body("category", "Invalid category").isIn(CategoryValue),
  body("condition", "Invalid Condition").isIn(ConditionValue),
  body("description", "Invalid description")
    .trim()
    .notEmpty()
    .isLength({ max: 100 })
    .escape(),
  body("price", "Invalid price")
    .trim()
    .notEmpty()
    .isInt({ min: 1, max: 10 })
    .escape(),
  body("avaiableStatus", "Invalid avaiableStatus").isBoolean(),

  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      await removeFile(req.file.filename);
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }
    res.status(200).json({
      message: "Successfully created a new book.",
    });
  },
];
