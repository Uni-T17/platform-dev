import { Book } from "../../generated/prisma";

export class BookDto {
  id: number;
  title: string;
  author: string;
  isbn?: string;
  category: string;
  condition: string;
  description?: string;
  image: string;
  price: number;
  avaiableStatus: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(book: Book) {
    this.id = book.id;
    this.title = book.title;
    this.author = book.author;
    this.isbn = book.isbn ?? undefined;
    this.category = book.category;
    this.condition = book.condition;
    this.description = book.description ?? undefined;
    this.image = book.image;
    this.price = book.price;
    this.avaiableStatus = book.avaiableStatus;
    this.createdAt = book.createdAt;
    this.updatedAt = book.updatedAt;
  }
}
