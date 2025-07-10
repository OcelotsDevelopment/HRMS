export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  departmentId: number;
  createdAt: string;
  updatedAt: string;
  headOf?: {
    id: number;
    name: string;
  };
};

export type Qualification = {
  id: number;
  degree: string;
  institute: string;
  year: number;
  userId: number;
};

export type Payroll = {
  id: number;
  startDate: string;
  endDate: string;
  baseSalary: number;
  incentive: number;
  deduction: number;
  userId: number;
};

export type BankDetail = {
  id: number;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branch: string;
  accountType: string;
  upiId?: string;
  userId: number;
};
