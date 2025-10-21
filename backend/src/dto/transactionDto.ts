import { Book, Transaction } from "../../generated/prisma";
import { BookDto } from "./bookDto";

export class TransactionDto {
  id: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  requestedBookId: number;
  book?: BookDto;
  sellerId: number;
  buyerId: number;
  transactionHistoryId: number;

  constructor(tx: Transaction & { book?: Book }) {
    this.id = tx.id;
    this.price = tx.price;
    this.createdAt = tx.createdAt;
    this.updatedAt = tx.updatedAt;
    this.requestedBookId = tx.requestedBookId;
    this.sellerId = tx.sellerId;
    this.buyerId = tx.buyerId;
    this.transactionHistoryId = tx.transactionHistoryId;
    if (tx.book) this.book = new BookDto(tx.book);
  }
}
