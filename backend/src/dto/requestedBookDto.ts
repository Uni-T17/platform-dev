import { Book, RequestedBook } from "../../generated/prisma";
import { BookDto } from "./bookDto";

export class RequestedBookDto {
  id: number;
  requestedPrice: number;
  requestedStatus: string;
  createdAt: Date;
  updatedAt: Date;
  book?: BookDto;
  sellerId: number;
  buyerId: number;

  constructor(req: RequestedBook & { book?: Book }) {
    this.id = req.id;
    this.requestedPrice = req.requestedPrice;
    this.requestedStatus = req.requestedStatus;
    this.createdAt = req.createdAt;
    this.updatedAt = req.updatedAt;
    this.sellerId = req.sellerId;
    this.buyerId = req.buyerId;
    if (req.book) this.book = new BookDto(req.book);
  }
}
