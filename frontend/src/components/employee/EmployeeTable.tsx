import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useEffect, useState, type JSX } from "react";
import { useEmployeeStore } from "../../store/employeeStore";

interface EmployeeRow {
  id: number;
  name: string;
  email: string;
  position?: string;
  coordinatore?: string;
  action: JSX.Element;
}

interface EmployeeTableProps {
  openModal: (id: number) => void;
}

export default function EmployeeTable({ openModal }: EmployeeTableProps) {
  const [tableData, setTableData] = useState<EmployeeRow[]>([]);
  const { employees, fetchEmployees } = useEmployeeStore();

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    const formatted = employees.map((employee) => ({
      id: employee.id,
      name: employee.name,
      email: employee.email,
      position: employee.designation ?? "—",
      coordinatore: employee?.coordinator?.name
        ? employee?.coordinator?.name
        : "-",
      action: (
        <button
          onClick={() => openModal(employee.id)}
          className="flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
        >
          Edit
        </button>
      ),
    }));
    setTableData(formatted);
  }, [employees, openModal]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Name
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Email
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Position
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Coordinator
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Action
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {tableData.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {employee.name}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {employee.email}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {employee.position}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {employee.coordinatore}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {employee.action}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
