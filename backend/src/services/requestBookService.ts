import { PrismaClient } from "../../generated/prisma";
import { RequestedStatus } from "../type/statusType";

const prisma = new PrismaClient();

export const findExistingRequest = async (
  bookId: number,
  buyerId: number,
  requestedStatus: RequestedStatus
) => {
  return await prisma.requestedBook.findFirst({
    where: {
      bookId,
      buyerId,
      requestedStatus: requestedStatus,
    },
  });
};

export const createNewRequest = async (requestData: any) => {
  return await prisma.requestedBook.create({
    data: requestData,
  });
};

export const getAllRequestsByBuyerId = async (userId: number) => {
  return await prisma.requestedBook.findMany({
    where: {
      buyerId: userId,
      requestedStatus: "PENDING",
    },
    include: {
      seller: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      book: {
        select: {
          id: true,
          title: true,
          author: true,
        },
      },
    },
  });
};

export const getAllRequestsBySellerId = async (sellerId: number) => {
  return await prisma.requestedBook.findMany({
    where: {
      sellerId: sellerId,
      requestedStatus: "PENDING",
    },
    include: {
      buyer: true,
      book: {
        select: {
          id: true,
          title: true,
          author: true,
        },
      },
    },
  });
};

export const updateRequest = async (requestId: number, updateData: any) => {
  return await prisma.requestedBook.update({
    where: {
      id: requestId,
    },
    data: updateData,
  });
};

export const findExistingRequestById = async (requestId: number) => {
  return await prisma.requestedBook.findUnique({
    where: {
      id: requestId,
    },
  });
};

export const rejectOtherRequestsForBook = async (
  bookId: number,
  excludeRequestId: number
) => {
  return await prisma.requestedBook.updateMany({
    where: {
      bookId: bookId,
      id: {
        not: excludeRequestId,
      },
      requestedStatus: "PENDING",
    },
    data: {
      requestedStatus: "REJECT",
      message:
        "Another request has been approved for this book. Please Delete this request to get refund credits!",
    },
  });
};
