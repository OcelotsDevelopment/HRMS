/*
  Warnings:

  - A unique constraint covering the columns `[userUniqueId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userUniqueId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_userUniqueId_key" ON "User"("userUniqueId");
