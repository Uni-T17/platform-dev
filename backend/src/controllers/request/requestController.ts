import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { createError, errorCode } from "../../utils/error";
import { getUserById } from "../../services/authServices";
import {
  checkBookNotExist,
  checkContactInfoExist,
  checkModelNotExist,
  checkUserNotExist,
} from "../../utils/check";
import {
  getBookDetailByBookId,
  updateBookByBookId,
} from "../../services/bookServices";
import { User } from "../../../generated/prisma";
import {
  createNewRequest,
  findExistingRequest,
  findExistingRequestById,
  getAllRequestsByBuyerId,
  getAllRequestsBySellerId,
  rejectOtherRequestsForBook,
  updateRequest,
} from "../../services/requestBookService";
import { RequestedStatus } from "../../type/statusType";
import {
  getCreditsByOwnerId,
  updateCredits,
} from "../../services/creditsServices";
import { RequestType } from "../../type/requestType";
import { turnDate } from "../../utils/turnDate";
import { create } from "domain";
import { createNewTransaction } from "../../services/transactionService";
import { updateTransactionHistoryByUserId } from "../../services/transactionHistoryService";
import { TransactionType } from "../../type/transactionType";

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
          "You don't have enough balance to request this book!",
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

    const resData = {
      requestedId: newRequest.id,
    };

    res
      .status(200)
      .json({ message: "Successfully Requested This book!", resData });
  },
];

export const getMyRequests = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
  status: RequestedStatus
) => {
  const buyer = await getUserById(req.userId!);
  checkUserNotExist(buyer);

  const requestLists = await getAllRequestsByBuyerId(buyer!.id, status);

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

export const getIncomingRequests = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
  status: RequestedStatus
) => {
  const seller = await getUserById(req.userId!);
  checkUserNotExist(seller);

  const requestLists = await getAllRequestsBySellerId(seller!.id, status);

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
        id: book.id,
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

export const approveOrRejectRequest = [
  body("requestId", "Invalid Request Id").trim().notEmpty().isInt({ min: 1 }),
  body("avaiableStatus", "Invalid Status!")
    .trim()
    .notEmpty()
    .isIn(["APPROVE", "REJECT"])
    .withMessage("Should Only APPROVE OR REJECT"),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }
    const avaiableStatus: string = req.body.avaiableStatus;
    const requestId: number = Number(req.body.requestId);

    const seller = await getUserById(req.userId!);
    checkUserNotExist(seller);

    const request = await findExistingRequestById(requestId);
    checkModelNotExist(request, "Request");

    // Allow only pending request
    if (request!.requestedStatus !== "PENDING") {
      return next(
        createError(
          "This request has been already processed!",
          400,
          errorCode.invalid
        )
      );
    }

    // If not owner not allow to approve/reject
    if (request!.sellerId !== seller!.id) {
      return next(
        createError(
          "You are not authorized to approve/reject this request!",
          403,
          errorCode.unauthorised
        )
      );
    }

    const buyerCredits = await getCreditsByOwnerId(request!.buyerId);
    // check credits balance is enough to buy the book

    // Approve
    if (avaiableStatus === "APPROVE") {
      // If balance not enough, not allow to approve
      if (buyerCredits!.balance < request!.requestedPrice) {
        return next(
          createError(
            "The buyer does not have enough balance to buy this book!",
            400,
            errorCode.invalid
          )
        );
      }

      // Update book avaiable status to false
      await updateBookByBookId(request!.bookId, { avaiableStatus: false });
      const transactionData: TransactionType = {
        price: request!.requestedPrice,
        requestedBookId: request!.id,
        bookId: request!.bookId,
        sellerId: request!.sellerId,
        buyerId: request!.buyerId,
        sellerHistoryId: seller!.id,
        buyerHistoryId: request!.buyerId,
      };
      const transaction = await createNewTransaction(transactionData);

      // Deduct buyer credits
      await updateCredits(buyerCredits!.id, {
        balance: { decrement: transaction!.price },
      });

      // Add seller credits
      const sellerCredits = await getCreditsByOwnerId(seller!.id);
      await updateCredits(sellerCredits!.id, {
        balance: { increment: transaction!.price },
      });

      // Update buyer transaction histories
      await updateTransactionHistoryByUserId(request!.buyerId, {
        transactionCount: { increment: 1 },
        totalIncome: { increment: transaction!.price },
      });
      // Update seller transaction history
      await updateTransactionHistoryByUserId(request!.sellerId, {
        transactionCount: { increment: 1 },
        totalOutcome: { increment: transaction!.price },
      });

      // Approve the request
      await updateRequest(requestId, { requestedStatus: "APPROVE" });
      // Reject other requests for the same book
      await rejectOtherRequestsForBook(request!.bookId, requestId);
    }

    // Reject
    if (avaiableStatus === "REJECT") {
      // Handle rejection logic
      await updateRequest(requestId, {
        requestedStatus: "REJECT",
      });
    }

    const resData = {
      message: "Successfully processed the request!",
      requestId,
    };
    res.status(200).json(resData);
  },
];

export const userUpdateRequest = [
  body("requestId", "Invalid Request Id").notEmpty().toInt().isInt({ min: 1 }),
  body("message", "Invalid message").optional().isLength({ max: 200 }).escape(),
  body("requestedPrice", "Invalid Request Price")
    .optional()
    .isInt({ min: 1 })
    .withMessage("requestedPrice must be >= 1"),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const buyer = await getUserById(req.userId!);
    checkUserNotExist(buyer);

    const { requestId, message, requestedPrice } = req.body;

    const request = await findExistingRequestById(Number(requestId));
    checkModelNotExist(request, "Request");

    if (request!.buyerId !== buyer!.id) {
      return next(
        createError(
          "You are not authorized to update this request!",
          403,
          errorCode.unauthorised
        )
      );
    }
    // Allow only pending request
    if (request!.requestedStatus !== "PENDING") {
      return next(
        createError(
          "This request has been already processed!",
          400,
          errorCode.invalid
        )
      );
    }

    // check book avaiable status
    const book = await getBookDetailByBookId(request!.bookId);
    checkBookNotExist(book);

    if (!book!.avaiableStatus) {
      return next(
        createError(
          "This book is unavaiable to request!Already sold out.",
          400,
          errorCode.invalid
        )
      );
    }

    const updateData: any = {};
    if (message) {
      updateData.message = message;
    }
    if (requestedPrice) {
      const credits = await getCreditsByOwnerId(buyer!.id);
      if (credits!.balance < Number(requestedPrice)) {
        return next(
          createError(
            "You don't have enough balance to request this book!",
            400,
            errorCode.invalid
          )
        );
      }
      updateData.requestedPrice = Number(requestedPrice);
    }
    await updateRequest(request!.id, updateData);

    const resData = {
      message: "Successfully Updated the request!",
      requestId: request!.id,
    };

    res.status(200).json(resData);
  },
];
