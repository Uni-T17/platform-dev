-- CreateEnum
CREATE TYPE "PreferredContact" AS ENUM ('PHONE', 'EMAIL');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "preferredContact" "PreferredContact" NOT NULL DEFAULT 'EMAIL';
