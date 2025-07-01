-- CreateEnum
CREATE TYPE "CompOffStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'USED');

-- CreateTable
CREATE TABLE "CompOff" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "workedFrom" TIMESTAMP(3) NOT NULL,
    "workedTo" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "daysGranted" INTEGER NOT NULL,
    "hoursEarned" DOUBLE PRECISION,
    "status" "CompOffStatus" NOT NULL DEFAULT 'PENDING',
    "appliedOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usedFrom" TIMESTAMP(3),
    "usedTo" TIMESTAMP(3),
    "leaveId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompOff_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CompOff" ADD CONSTRAINT "CompOff_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompOff" ADD CONSTRAINT "CompOff_leaveId_fkey" FOREIGN KEY ("leaveId") REFERENCES "Leave"("id") ON DELETE SET NULL ON UPDATE CASCADE;
