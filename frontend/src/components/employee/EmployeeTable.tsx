import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useEffect, useState, type JSX } from "react";
import { useEmployeeStore } from "../../store/employeeStore";
import { useNavigate } from "react-router-dom";

interface EmployeeRow {
  id: number;
  employeeId:string;
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

  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    const formatted = employees.map((employee) => ({
      id: employee.id,
      employeeId:employee.employeeUniqueId,
      name: employee.name,
      email: employee.email,
      position: employee.designation ?? "—",
      coordinatore: employee?.coordinator?.name
        ? employee?.coordinator?.name
        : "-",
      action: (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => openModal(employee.id)}
            className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 "
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.5 3.5L20.5 7.5M4 20H8L18.29 9.71C18.68 9.32 18.68 8.68 18.29 8.29L15.71 5.71C15.32 5.32 14.68 5.32 14.29 5.71L4 16V20Z"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
              />
            </svg>
          </button>

          <button
            onClick={() => navigate(`add-details/${employee.id}`)}
            className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 "
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 12C2.73 7.61 7.17 4.5 12 4.5C16.83 4.5 21.27 7.61 23 12C21.27 16.39 16.83 19.5 12 19.5C7.17 19.5 2.73 16.39 1 12Z"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
              />
              <circle
                cx="12"
                cy="12"
                r="3"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      ),
    }));
    setTableData(formatted);
  }, [employees, openModal,navigate]);

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
                Employee ID
              </TableCell>
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
                 OCLT - {employee.employeeId}
                </TableCell>
                
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
