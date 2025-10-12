import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { createError, errorCode } from "../utils/error";

export const register = [
  body("email", "Invalid Email Address!")
    .trim()
    .notEmpty()
    .isEmail()
    .withMessage("Please enter a valid email address."),
  body("name", "Invalid Name")
    .notEmpty()
    .withMessage("Username Must Not Empty!")
    .isLength({ max: 50 }),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }
    const { email, name } = req.body;

    res.status(200).json({
      email: email,
      name: name,
    });
  },
];
