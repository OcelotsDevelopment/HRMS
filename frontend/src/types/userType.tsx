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