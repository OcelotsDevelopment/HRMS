import { useEffect, useState, type ReactNode } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useEmployeeStore } from "../../store/employeeStore";
import PaginationControls from "../ui/pagination/PaginationControls";
import DataTable from "../common/DataTable";

// Core types
export type RowData = Record<string, ReactNode>;

export interface Column<T extends RowData> {
  key: keyof T;
  label: string;
  isAction?: boolean;
}

// interface Employee {
//   id: number;
//   name: string;
// }

interface PayrollExportRow {
  Month: string;
  "Basic Salary": string;
  Allowances: string;
  Deductions: string;
  "Net Salary": string;
  employee: string; // 👈 this was previously: Employee
}

// Make sure this extends RowData
interface PayrollRow extends RowData {
  id: number;
  month: string;
  basicSalary: string;
  allowances: string;
  deductions: string;
  netSalary: string;
  employee: string; // 👈 not Employee object, just the name
  action: ReactNode;
}

export default function PayrollTable() {
  const [tableData, setTableData] = useState<PayrollRow[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { allPayrolls, fetchAllPayrolls, payrollPagination } =
    useEmployeeStore();

  // Fetch payroll data on mount or page change
  useEffect(() => {
    fetchAllPayrolls(currentPage, 10);
  }, [currentPage, fetchAllPayrolls]);

  // Format data when allPayrolls updates
  useEffect(() => {
    if (allPayrolls && Array.isArray(allPayrolls)) {
      const formatted = allPayrolls.map((p) => {
        const exportRow: PayrollExportRow = {
          Month: `${p.month.toString().padStart(2, "0")}/${p.year}`,
          "Basic Salary": `₹ ${p.baseSalary.toFixed(2)}`,
          Allowances: `₹ ${(p.hra + (p.otherAllowances || 0)).toFixed(2)}`,
          Deductions: `₹ ${(
            (p.epf || 0) +
            (p.esi || 0) +
            (p.taxDeduction || 0)
          ).toFixed(2)}`,
          "Net Salary": `₹ ${p.netPay?.toFixed(2) ?? "0.00"}`,
          employee: p.employee?.name ?? "—", // 👈 use name only
        };

        return {
          id: p.id!,
          month: exportRow.Month,
          basicSalary: exportRow["Basic Salary"],
          allowances: exportRow.Allowances,
          deductions: exportRow.Deductions,
          netSalary: exportRow["Net Salary"],
          employee: exportRow.employee, // 👈 assign string
          action: renderActions(exportRow, p.month, p.year),
        };
      });

      setTableData(formatted);
    }
  }, [allPayrolls]);

  // Render export buttons
  const renderActions = (
    data: PayrollExportRow,
    month: number,
    year: number
  ): ReactNode => (
    <div className="flex items-center gap-2">
      <button
        onClick={() => downloadCSV([data], `payslip-${month}-${year}.csv`)}
        className="rounded border px-3 py-1 text-xs text-gray-700 shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
      >
        CSV
      </button>
      <button
        onClick={() => downloadPDF([data], `payslip-${month}-${year}.pdf`)}
        className="rounded border px-3 py-1 text-xs text-gray-700 shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
      >
        PDF
      </button>
    </div>
  );

  // CSV download
  const downloadCSV = (data: PayrollExportRow[], filename = "payroll.csv") => {
    if (!data.length) return;
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(",")];
    data.forEach((row) => {
      const values = headers.map((h) =>
        JSON.stringify(row[h as keyof PayrollExportRow])
      );
      csvRows.push(values.join(","));
    });
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  // PDF download
  const downloadPDF = (data: PayrollExportRow[], filename = "payroll.pdf") => {
    const doc = new jsPDF();
    const tableData = data.map((row) => [
      row.Month,
      row["Basic Salary"],
      row.Allowances,
      row.Deductions,
      row["Net Salary"],
    ]);
    autoTable(doc, {
      head: [
        ["Month", "Basic Salary", "Allowances", "Deductions", "Net Salary"],
      ],
      body: tableData,
      theme: "grid",
    });
    doc.save(filename);
  };

  // Define table columns
  const columns: Column<PayrollRow>[] = [
    { key: "employee", label: "Employee" }, // 👈 new column
    { key: "month", label: "Month" },
    { key: "basicSalary", label: "Basic Salary" },
    { key: "allowances", label: "Allowances" },
    { key: "deductions", label: "Deductions" },
    { key: "netSalary", label: "Net Salary" },
    { key: "action", label: "Actions", isAction: true },
  ];

  return (
    <div className="mt-6">
      <DataTable columns={columns} rows={tableData} />
      <div className="mt-6">
      <PaginationControls
        currentPage={payrollPagination.page}
        totalPages={payrollPagination.totalPages}
        onPageChange={setCurrentPage}
      />
      </div>
    </div>
  );
}
