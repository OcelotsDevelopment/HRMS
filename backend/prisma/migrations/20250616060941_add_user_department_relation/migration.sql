-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "coordinatorId" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "departmentId" INTEGER;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_coordinatorId_fkey" FOREIGN KEY ("coordinatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
