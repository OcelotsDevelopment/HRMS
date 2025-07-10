/*
  Warnings:

  - A unique constraint covering the columns `[userId,date]` on the table `DailyAttendance` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "DailyAttendance" DROP CONSTRAINT "DailyAttendance_employeeId_fkey";

-- AlterTable
ALTER TABLE "DailyAttendance" ALTER COLUMN "employeeId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DailyAttendance_userId_date_key" ON "DailyAttendance"("userId", "date");

-- AddForeignKey
ALTER TABLE "DailyAttendance" ADD CONSTRAINT "DailyAttendance_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
