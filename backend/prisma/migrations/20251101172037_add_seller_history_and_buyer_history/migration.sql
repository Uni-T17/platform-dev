/*
  Warnings:

  - You are about to drop the column `transactionHistoryId` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `buyerHistoryId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sellerHistoryId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Transaction" DROP CONSTRAINT "Transaction_transactionHistoryId_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "transactionHistoryId",
ADD COLUMN     "buyerHistoryId" INTEGER NOT NULL,
ADD COLUMN     "sellerHistoryId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_sellerHistoryId_fkey" FOREIGN KEY ("sellerHistoryId") REFERENCES "TransactionHistory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_buyerHistoryId_fkey" FOREIGN KEY ("buyerHistoryId") REFERENCES "TransactionHistory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
