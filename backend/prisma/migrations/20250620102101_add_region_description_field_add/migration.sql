/*
  Warnings:

  - A unique constraint covering the columns `[description]` on the table `Region` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `description` to the `Region` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Region" ADD COLUMN     "description" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Region_description_key" ON "Region"("description");
