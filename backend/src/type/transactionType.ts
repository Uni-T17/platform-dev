// model Transaction{
//   id Int @id @default(autoincrement())
//   price Int
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt

//   requestedBook RequestedBook @relation(fields: [requestedBookId],references: [id])
//   requestedBookId Int @unique

//   book Book @relation(fields: [bookId],references: [id])
//   bookId Int @unique

//   seller User @relation("sellerTransaction",fields: [sellerId],references: [id])
//   sellerId Int

//   buyer User @relation("buyerTransaction",fields: [buyerId],references: [id])
//   buyerId Int

//   transactionHistory TransactionHistory @relation(fields: [transactionHistoryId],references: [id],onDelete: Cascade,onUpdate: Cascade)
//   transactionHistoryId Int
//   review Review?

// }

export type TransactionType = {
  price: number;
  requestedBookId: number;
  bookId: number;
  sellerId: number;
  buyerId: number;
  sellerHistoryId: number;
  buyerHistoryId: number;
};

export type CompleteTransactionType = {
  transactionId: number;
  bookName: string;
  authorName: string;
  buyerId: number;
  givenTo: string;
  price: number;
  sellerId: number;
  recievedFrom: string;
  completedAt: string;
  isOwner: boolean;
  review: string | null;
  rating: number | null;
};

export type ReviewDataType = {
  transactionId: number;
  rating: number;
  description?: string;
  reviewToId: number;
  reviewById: number;
  transactionHistoryId: number;
};
