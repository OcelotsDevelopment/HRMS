import type { ReactNode } from "react";

export type Employee = {
  id: number;
  name: string;
  email: string;
  mobile?: string;
  designation?: string;
  sex?: string;
  dob?: string;
  age?: number;
  placeOfBirth?: string;
  height?: number;
  weight?: number;
  bloodGroup?: string;
  nationality?: string;
  maritalStatus?: string;
  currentAddress?: string;
  currentPinCode?: string;
  permanentAddress?: string;
  permanentPinCode?: string;
  departmentId?: number;
  coordinatorId?: number;
  employeeCode?: string;
  dateOfJoining?: string;
  position?: string;
  salaryOnJoining?: number;
  reportingTo?: string;
  hiredBy?: string;
  replacementOf?: string;
  isRehire?: boolean;
  liabilitiesDetails?: string;
  familyBackground?: string;
  hasFamilyBusiness?: boolean;
  familyBusinessDetails?: string;
  isPhysicallyImpaired?: boolean;
  impairmentDetails?: string;
};
export interface EarningsRow extends Record<string, ReactNode> {
  [key: string]: ReactNode;
  cycle: string;
  baseSalary: string;
  incentives: string;
  deductions: string;
  netPay: string;
  workingDays: string;
  leaveDays: string;
}

export interface EarningsSummaryRaw {
  cycle: string;
  baseSalary: number;
  incentives: number;
  deductions: number;
  netPay: number;
  workingDays: number;
  leaveDays: number;
  employeeName: string;
}

export interface EarningsRow {
  cycle: string;
  baseSalary: string;
  incentives: string;
  deductions: string;
  netPay: string;
  workingDays: string;
  leaveDays: string;
}