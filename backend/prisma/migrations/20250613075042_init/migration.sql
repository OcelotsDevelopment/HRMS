/*
  Warnings:

  - A unique constraint covering the columns `[employeeCode]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_departmentId_fkey";

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "age" INTEGER,
ADD COLUMN     "bloodGroup" TEXT,
ADD COLUMN     "currentAddress" TEXT,
ADD COLUMN     "dateOfJoining" TIMESTAMP(3),
ADD COLUMN     "designation" TEXT,
ADD COLUMN     "dob" TIMESTAMP(3),
ADD COLUMN     "employeeCode" TEXT,
ADD COLUMN     "familyBackground" TEXT,
ADD COLUMN     "familyBusinessDetails" TEXT,
ADD COLUMN     "hasFamilyBusiness" BOOLEAN DEFAULT false,
ADD COLUMN     "height" DOUBLE PRECISION,
ADD COLUMN     "hiredBy" TEXT,
ADD COLUMN     "impairmentDetails" TEXT,
ADD COLUMN     "isPhysicallyImpaired" BOOLEAN DEFAULT false,
ADD COLUMN     "isRehire" BOOLEAN DEFAULT false,
ADD COLUMN     "liabilitiesDetails" TEXT,
ADD COLUMN     "maritalStatus" TEXT,
ADD COLUMN     "mobile" TEXT,
ADD COLUMN     "nationality" TEXT,
ADD COLUMN     "permanentAddress" TEXT,
ADD COLUMN     "placeOfBirth" TEXT,
ADD COLUMN     "position" TEXT,
ADD COLUMN     "replacementOf" TEXT,
ADD COLUMN     "reportingTo" TEXT,
ADD COLUMN     "salaryOnJoining" DOUBLE PRECISION,
ADD COLUMN     "sex" TEXT,
ADD COLUMN     "weight" DOUBLE PRECISION,
ALTER COLUMN "departmentId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Qualification" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "standard" TEXT NOT NULL,
    "fromYear" INTEGER NOT NULL,
    "toYear" INTEGER NOT NULL,
    "percentage" DOUBLE PRECISION,

    CONSTRAINT "Qualification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employment" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "employerName" TEXT NOT NULL,
    "positionHeld" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "workedFrom" TIMESTAMP(3) NOT NULL,
    "workedTill" TIMESTAMP(3) NOT NULL,
    "lastSalaryDrawn" DOUBLE PRECISION,
    "reasonForLeaving" TEXT,
    "remarks" TEXT,

    CONSTRAINT "Employment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reference" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "positionHeld" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "contact" TEXT NOT NULL,

    CONSTRAINT "Reference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_employeeCode_key" ON "Employee"("employeeCode");

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Qualification" ADD CONSTRAINT "Qualification_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employment" ADD CONSTRAINT "Employment_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reference" ADD CONSTRAINT "Reference_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
