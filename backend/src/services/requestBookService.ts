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

export const getAllRequestsByUserId = async (userId: number) => {
  return await prisma.requestedBook.findMany({
    where: {
      buyerId: userId,
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
