import {
  User,
  Credits,
  TransactionHistory,
  Book,
} from "../../generated/prisma";

import { CreditsDto } from "./creditsDto";
import { TransactionHistoryDto } from "./transactionHistoryDto";
import { BookDto } from "./bookDto";

export class UserDto {
  id: number;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  bio?: string;
  preferredContact: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  credits?: CreditsDto;
  transactionHistory?: TransactionHistoryDto;
  books?: BookDto[];

  constructor(
    user: User & {
      credits?: Credits;
      transactionHistory?: TransactionHistory;
      book?: Book[];
    }
  ) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
    this.phone = user.phone ?? "Doesn't have phone number yet";
    this.address = user.address ?? "Doesn't have any address yet";
    this.bio = user.bio ?? "Doesn't have any bio yet!";
    this.preferredContact = user.preferredContact;
    this.status = user.status;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    if (user.credits) this.credits = new CreditsDto(user.credits);
    if (user.transactionHistory)
      this.transactionHistory = new TransactionHistoryDto(
        user.transactionHistory
      );
    if (user.book) this.books = user.book.map((b) => new BookDto(b));
  }
}
