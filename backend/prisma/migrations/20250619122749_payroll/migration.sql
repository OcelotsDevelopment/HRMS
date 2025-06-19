/*
  Warnings:

  - A unique constraint covering the columns `[employeeId,month,year]` on the table `Payroll` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Payroll_employeeId_month_year_key" ON "Payroll"("employeeId", "month", "year");
