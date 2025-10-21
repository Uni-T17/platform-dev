import { Transaction, TransactionHistory } from "../../generated/prisma";
import { TransactionDto } from "./transactionDto";

export class TransactionHistoryDto {
  id: number;
  transactionCount: number;
  totalIncome: number;
  totalOutcome: number;
  averageRating: number;
  ownerId: number;
  transactions?: TransactionDto[];

  constructor(history: TransactionHistory & { transactions?: Transaction[] }) {
    this.id = history.id;
    this.transactionCount = history.transactionCount;
    this.totalIncome = history.totalIncome;
    this.totalOutcome = history.totalOutcome;
    this.averageRating = history.averageRating;
    this.ownerId = history.ownerId;
    if (history.transactions)
      this.transactions = history.transactions.map(
        (t) => new TransactionDto(t)
      );
  }
}
