/*
  Warnings:

  - A unique constraint covering the columns `[employeeUniqueId]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Employee_employeeUniqueId_key" ON "Employee"("employeeUniqueId");
