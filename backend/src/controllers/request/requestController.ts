import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { createError, errorCode } from "../../utils/error";
import { getUserById } from "../../services/authServices";
import {
  checkBookNotExist,
  checkContactInfoExist,
  checkUserNotExist,
} from "../../utils/check";
import { getBookDetailByBookId } from "../../services/bookServices";
import { User } from "../../../generated/prisma";
import {
  createNewRequest,
  findExistingRequest,
  getAllRequestsByBuyerId,
  getAllRequestsBySellerId,
} from "../../services/requestBookService";
import { RequestedStatus } from "../../type/statusType";
import {
  getCreditsByOwnerId,
  updateCredits,
} from "../../services/creditsServices";
import { RequestType } from "../../type/requestType";
import { turnDate } from "../../utils/turnDate";

interface CustomRequest extends Request {
  userId?: number;
}

export const userRequestBook = [
  body("bookId", "Invalid Book Id")
    .exists()
    .withMessage("bookId is required")

    .isInt({ min: 1 })
    .withMessage("bookId must be >= 1"),
  body("requestedPrice", "Invalid Request Price")
    .exists()
    .withMessage("requestedPrice is required")
    .isInt({ min: 1 })
    .withMessage("requestedPrice must be >= 1"),
  body("message", "Invalid message").optional().isLength({ max: 200 }).escape(),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const buyer = await getUserById(req.userId!);
    checkUserNotExist(buyer);
    checkContactInfoExist(buyer);

    const { bookId, requestedPrice, message } = req.body;

    const credits = await getCreditsByOwnerId(buyer!.id);

    if (credits!.balance < Number(requestedPrice)) {
      return next(
        createError(
          "You don't have enough balance to buy request this book!",
          400,
          errorCode.invalid
        )
      );
    }

    const book = await getBookDetailByBookId(Number(bookId));
    checkBookNotExist(book);

    if (!book!.avaiableStatus) {
      return next(
        createError(
          "This book is unavaiable to request!!",
          400,
          errorCode.invalid
        )
      );
    }

    if (buyer!.id === book!.ownerId) {
      return next(
        createError("You can't request your own book!", 400, errorCode.invalid)
      );
    }
    const seller = await getUserById(book!.ownerId);
    checkUserNotExist(seller);

    const existingRequest = await findExistingRequest(
      book!.id,
      buyer!.id,
      RequestedStatus.PENDING
    );
    if (existingRequest) {
      return next(
        createError("You already request this book!", 400, errorCode.invalid)
      );
    }
    const requestData = {
      requestedPrice: Number(requestedPrice),
      message: message ?? null,
      requestedStatus: "PENDING",
      bookId: book!.id,
      sellerId: seller!.id,
      buyerId: buyer!.id,
    };

    const newRequest = await createNewRequest(requestData);
    const creditData = {
      balance: credits!.balance - newRequest!.requestedPrice,
    };
    const newCredits = await updateCredits(credits!.id, creditData);
    const resData = {
      requestedId: newRequest.id,
      creditsBalance: newCredits.balance,
    };

    res
      .status(200)
      .json({ message: "Successfully Requested This book!", resData });
  },
];

export const getMyRequests = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const buyer = await getUserById(req.userId!);
  checkUserNotExist(buyer);

  const requestLists = await getAllRequestsByBuyerId(buyer!.id);

  if (!requestLists || requestLists.length === 0) {
    return res.status(200).json({ message: "There is no requested book!" });
  }

  const myRequestLists: RequestType[] = requestLists.map((request) => {
    const date = request.createdAt;
    const requestedDate = turnDate(date);
    return {
      book: {
        id: request.book.id,
        title: request.book.title,
        author: request.book.author,
      },
      requestDetail: {
        requestId: request.id,
        requestedAt: requestedDate,
        requestedStatus: request.requestedStatus.toString(),
        requestedPrice: request.requestedPrice,
        message: request.message ?? null,
      },
      seller: {
        id: request.seller.id,
        name: request.seller.name,
      },
    };
  });

  const resData = {
    message: "Success",
    myRequestLists,
  };

  res.status(200).json(resData);
};

export const getRequestsForMyBook = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const seller = await getUserById(req.userId!);
  checkUserNotExist(seller);

  const requestLists = await getAllRequestsBySellerId(seller!.id);

  if (!requestLists || requestLists.length === 0) {
    return res.status(200).json({ message: "There is no requested book!" });
  }

  const myRequestLists: RequestType[] = requestLists.map((request) => {
    const date = request.createdAt;
    const requestedDate = turnDate(date);
    const buyer = request.buyer;
    const book = request.book;
    return {
      book: {
        id: buyer.id,
        title: book.title,
        author: book.author,
      },
      requestDetail: {
        requestId: request.id,
        requestedAt: requestedDate,
        requestedStatus: request.requestedStatus.toString(),
        requestedPrice: request.requestedPrice,
        message: request.message ?? null,
      },
      buyer: {
        id: buyer.id,
        name: buyer.name,
        contactInfo: {
          email: buyer.email,
          phone: buyer.phone,
          address: buyer.address,
          preferredContact: buyer.preferredContact,
        },
      },
    };
  });

  const totalRequests = requestLists.length;

  const resData = {
    message: "Success",
    myRequestLists,
    totalRequests,
  };

  res.status(200).json(resData);
};
