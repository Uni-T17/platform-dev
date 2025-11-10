import { prisma } from ".";

import { CreateBookType } from "../type/bookType";

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

export const getBookDetailAndRequestByBookId = async (bookId: number) => {
  return await prisma.book.findUnique({
    where: {
      id: bookId,
    },
    include: {
      requestedBooks: true,
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

export const updateBookByBookId = async (bookId: number, updateData: any) => {
  return await prisma.book.update({
    where: {
      id: bookId,
    },
    data: updateData,
  });
};

export const getAllBooks = async (cursor: number | null, limit: number) => {
  return await prisma.book.findMany({
    take: limit + 1,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    orderBy: {
      createdAt: "asc",
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

export const deleteBookById = async (bookId: number) => {
  return await prisma.book.delete({
    where: {
      id: bookId,
    },
  });
};
