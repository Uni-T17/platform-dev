import { Request, Response, NextFunction } from "express";
import { getUserById, updateUser } from "../../services/authServices";
import {
  checkCreditsExist,
  checkTractionHistoryExist,
  checkUserNotExist,
} from "../../utils/check";
import {
  CurrentUserProfileType,
  PublicProfileType,
} from "../../type/profileType";
import { getTransactionHistoryByUserId } from "../../services/transactionHistoryService";
import { getCreditsByOwnerId } from "../../services/creditsServices";
import { getBookCountByOwnerId } from "../../services/bookServices";
import { body, param, validationResult } from "express-validator";
import { createError, errorCode } from "../../utils/error";
import { turnDate } from "../../utils/turnDate";

interface CustomRequest extends Request {
  userId?: number;
}

export const getCurrentUserProfile = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const user = await getUserById(userId!);
  checkUserNotExist(user);
  const transactionHistory = await getTransactionHistoryByUserId(user!.id);
  checkTractionHistoryExist(transactionHistory);
  const credits = await getCreditsByOwnerId(user!.id);
  checkCreditsExist(credits);
  const bookListed = await getBookCountByOwnerId(user!.id);
  const createdDate = turnDate(user!.createdAt);

  const resData: CurrentUserProfileType = {
    profileCard: {
      name: user!.name,
      email: user!.email,
      rating:
        transactionHistory!.averageRating /
          transactionHistory!.transactionCount || 0,
      memberSince: createdDate,
      bio: user!.bio,
      liveIn: user!.address,
    },
    creditsBalance: credits!.balance,
    bookListed: bookListed,
    exchanges: transactionHistory!.transactionCount,
    contactInfo: {
      phone: user!.phone,
      address: user!.address,
      prefferedContact: user!.preferredContact,
    },
  };

  res.status(200).json({
    message: "Success",
    data: resData,
  });
};

export const updateOwnerProfile = [
  body("name", "Invalid Name!").trim().notEmpty().escape(),
  body("bio", "Invalid Bio!")
    .customSanitizer((value) => (value === null ? undefined : value))
    .optional()
    .isLength({ max: 200 })
    .escape(),
  body("address", "Invalid Address!")
    .customSanitizer((value) => (value === null ? undefined : value))
    .optional()
    .isLength({ max: 200 })
    .escape(),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }
    const userId = req.userId;
    const user = await getUserById(userId!);
    checkUserNotExist(user);

    const { name, bio, address } = req.body;
    const userData = {
      name,
      bio,
      address,
    };

    await updateUser(user!.id, userData);

    res.status(200).json({
      message: "Successfully updated Profile.",
    });
  },
];

export const updateContactInfo = [
  body("phone", "Invalid Phone!")
    .customSanitizer((value) => (value === null ? undefined : value))
    .optional()
    .matches(/^\+?[0-9]+$/)
    .isLength({ min: 5, max: 15 })
    .withMessage("Phone Number Must Be 5-12 numbers"),
  body("address", "Invalid Address!")
    .customSanitizer((value) => (value === null ? undefined : value))
    .optional()
    .isLength({ max: 200 })
    .escape(),
  body("preferredContact", "preferredContact is only email or phone").isIn([
    "EMAIL",
    "PHONE",
  ]),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }
    const userId = req.userId;
    const user = await getUserById(userId!);
    checkUserNotExist(user);

    const { address, phone, preferredContact } = req.body;
    const userData = {
      address,
      phone,
      preferredContact,
    };

    await updateUser(user!.id, userData);

    res.status(200).json({
      message: "Successfully updated Contact Info.",
    });
  },
];

export const getPublicProfile = [
  param("userId", "Invalid UserId")
    .trim()
    .notEmpty()
    .isInt({ min: 1 })
    .escape(),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }
    const userId = Number(req.params.userId);
    const user = await getUserById(userId!);
    checkUserNotExist(user);
    const transactionHistory = await getTransactionHistoryByUserId(user!.id);
    checkTractionHistoryExist(transactionHistory);
    const bookListed = await getBookCountByOwnerId(user!.id);

    const resData: PublicProfileType = {
      profileCard: {
        name: user!.name,
        rating: transactionHistory!.averageRating,
        memberSince: user!.createdAt,
        bio: user!.bio,
        liveIn: user!.address,
      },
      bookListed: bookListed,
      exchanges: transactionHistory!.transactionCount,
      contactInfo: {
        phone: user!.phone,
        address: user!.address,
        prefferedContact: user!.preferredContact,
      },
    };

    res.status(200).json({
      message: "Success",
      data: resData,
    });
  },
];
