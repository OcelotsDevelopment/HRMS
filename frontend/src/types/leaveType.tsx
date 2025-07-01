import type { Employee } from "./employeeType";
import type { User } from "./userType";

// Leave
export type Leave = {
  id: number;
  title: string;
  description?: string;
  from: string;
  to: string;
  type: string;
  isPaid: boolean;
  status: "Pending" | "Approved" | "Rejected";
  employeeId: number;
  appliedById: number;
  appliedByEmployeeId?: number | null;
  appliedByUserId?: number | null;
  employee?: Employee | null;
  appliedByEmployee?: Employee | null;
  appliedByUser?: User | null;
  createdAt: string;
  updatedAt: string;
};


export type CompOff = {
  id: number;
  title:string;
  employeeId: number;
  workedFrom: string;
  workedTo: string;
  reason?: string;
  daysGranted: number;
  hoursEarned: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "USED";
  appliedOn: string;
  usedFrom?: string;
  usedTo?: string;
  leaveId?: number;
  createdAt: string;
  updatedAt: string;
  employee?:Employee
};
