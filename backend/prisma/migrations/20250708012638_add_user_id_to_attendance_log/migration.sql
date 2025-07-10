/*
  Warnings:

  - A unique constraint covering the columns `[userId,timestamp]` on the table `AttendanceLog` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "AttendanceLog" DROP CONSTRAINT "AttendanceLog_employeeId_fkey";

-- AlterTable
ALTER TABLE "AttendanceLog" ADD COLUMN     "userId" INTEGER,
ALTER COLUMN "employeeId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "BankDetail" ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "CompOff" ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "DailyAttendance" ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "Employment" ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "Payroll" ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "Qualification" ADD COLUMN     "userUniqueId" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "employeeId" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Reference" ADD COLUMN     "userId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceLog_userId_timestamp_key" ON "AttendanceLog"("userId", "timestamp");

-- AddForeignKey
ALTER TABLE "Qualification" ADD CONSTRAINT "Qualification_userUniqueId_fkey" FOREIGN KEY ("userUniqueId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employment" ADD CONSTRAINT "Employment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankDetail" ADD CONSTRAINT "BankDetail_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reference" ADD CONSTRAINT "Reference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payroll" ADD CONSTRAINT "Payroll_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompOff" ADD CONSTRAINT "CompOff_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceLog" ADD CONSTRAINT "AttendanceLog_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceLog" ADD CONSTRAINT "AttendanceLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyAttendance" ADD CONSTRAINT "DailyAttendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
