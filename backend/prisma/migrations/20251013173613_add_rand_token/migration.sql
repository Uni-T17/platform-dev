/*
  Warnings:

  - Added the required column `randToken` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "errorLoginCount" SMALLINT NOT NULL DEFAULT 0,
ADD COLUMN     "lastLogin" TIMESTAMP(3),
ADD COLUMN     "randToken" TEXT NOT NULL;
