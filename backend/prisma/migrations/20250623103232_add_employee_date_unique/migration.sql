/*
  Warnings:

  - A unique constraint covering the columns `[employeeId,date]` on the table `DailyAttendance` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DailyAttendance_employeeId_date_key" ON "DailyAttendance"("employeeId", "date");
