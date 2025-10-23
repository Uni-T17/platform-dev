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
