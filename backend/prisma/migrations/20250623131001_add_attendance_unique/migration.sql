/*
  Warnings:

  - A unique constraint covering the columns `[employeeId,timestamp]` on the table `AttendanceLog` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AttendanceLog_employeeId_timestamp_key" ON "AttendanceLog"("employeeId", "timestamp");
