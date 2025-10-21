import { Credits } from "../../generated/prisma";

export class CreditsDto {
  id: number;
  balance: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(credits: Credits) {
    this.id = credits.id;
    this.balance = credits.balance;
    this.createdAt = credits.createdAt;
    this.updatedAt = credits.updatedAt;
  }
}
