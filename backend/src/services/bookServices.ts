import { PrismaClient } from "../../generated/prisma";
import { CreateBookType } from "../type/bookType";

const prisma = new PrismaClient();

export const getBookCountByOwnerId = async (ownerId: number) => {
  return await prisma.book.count({
    where: { ownerId },
  });
};

export const createNewBook = async (bookData: CreateBookType) => {
  const data: any = {
    title: bookData.title,
    author: bookData.author,
    isbn: bookData.isbn,
    category: bookData.category,
    condition: bookData.condition,
    description: bookData.description,
    image: bookData.image,
    price: bookData.price,
    ownerId: bookData.ownerId,
  };
  return await prisma.book.create({
    data,
  });
};

export const getBookDetailByBookId = async (bookId: number) => {
  return await prisma.book.findUnique({
    where: {
      id: bookId,
    },
    include: {
      bookOwner: {
        select: {
          id: true,
          name: true,
          transactionHistory: {
            select: {
              averageRating: true,
            },
          },
        },
      },
    },
  });
};

export const getAllBooksByUserId = async (ownerId: number) => {
  return await prisma.book.findMany({
    where: {
      ownerId: ownerId,
    },
    include: {
      bookOwner: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
