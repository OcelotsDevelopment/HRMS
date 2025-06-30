import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../../ui/table";
import { useEffect, useState, type JSX } from "react";
import { useEmployeeStore } from "../../../../../store/employeeStore";
import { useParams } from "react-router-dom";
import { useModal } from "../../../../../hooks/useModal";
import { Modal } from "../../../../ui/modal";
import AddPayrollForm from "./PayrollAddForm";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface PayrollRow {
  id: number;
  month: string;
  basicSalary: string;
  allowances: string;
  deductions: string;
  netSalary: string;
  action: JSX.Element;
}

interface PayrollExportRow {
  Month: string;
  "Basic Salary": string;
  Allowances: string;
  Deductions: string;
  "Net Salary": string;
}

export default function PayrollTable() {
  const { id } = useParams();
  const { isOpen, openModal, closeModal } = useModal();
  const [tableData, setTableData] = useState<PayrollRow[]>([]);
  const { payrolls, fetchPayrolls } = useEmployeeStore();

  useEffect(() => {
    if (id) fetchPayrolls(Number(id));
  }, [id, fetchPayrolls]);

  useEffect(() => {
    if (payrolls && Array.isArray(payrolls)) {
      closeModal();
      const formatted = payrolls.map((p) => ({
        id: p.id!,
        month: `${p.month.toString().padStart(2, "0")}/${p.year}`,
        basicSalary: `₹ ${p.baseSalary.toFixed(2)}`,
        allowances: `₹ ${(p.hra + (p.otherAllowances || 0)).toFixed(2)}`,
        deductions: `₹ ${(
          (p.epf || 0) +
          (p.esi || 0) +
          (p.taxDeduction || 0)
        ).toFixed(2)}`,
        netSalary: `₹ ${p.netPay?.toFixed(2) ?? "0.00"}`,
        action: (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const exportData: PayrollExportRow[] = payrolls.map((pay) => ({
                  Month: `${pay.month.toString().padStart(2, "0")}/${pay.year}`,
                  "Basic Salary": `₹ ${pay.baseSalary.toFixed(2)}`,
                  Allowances: `₹ ${(
                    pay.hra + (pay.otherAllowances || 0)
                  ).toFixed(2)}`,
                  Deductions: `₹ ${(
                    (pay.epf || 0) +
                    (pay.esi || 0) +
                    (pay.taxDeduction || 0)
                  ).toFixed(2)}`,
                  "Net Salary": `₹ ${pay.netPay?.toFixed(2) ?? "0.00"}`,
                }));
                downloadCSV(exportData, `payslip-${p.month}-${p.year}.csv`);
              }}
              className="rounded border px-3 py-1 text-xs text-gray-700 shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              CSV
            </button>

            <button
              onClick={() =>
                downloadPDF(
                  tableData.map((row) => ({
                    Month: row.month,
                    "Basic Salary": row.basicSalary,
                    Allowances: row.allowances,
                    Deductions: row.deductions,
                    "Net Salary": row.netSalary,
                  })),
                  "payroll.pdf"
                )
              }
              className="rounded border px-3 py-1 text-xs text-gray-700 shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              PDF
            </button>
          </div>
        ),
      }));
      setTableData(formatted);
    }
  }, [payrolls]);

  const downloadCSV = (data: PayrollExportRow[], filename = "payroll.csv") => {
    if (!data.length) return;

    const headers = Object.keys(data[0]);
    const csvRows: string[] = [];

    csvRows.push(headers.join(","));

    for (const row of data) {
      const values = [
        JSON.stringify(row["Month"]),
        JSON.stringify(row["Basic Salary"]),
        JSON.stringify(row["Allowances"]),
        JSON.stringify(row["Deductions"]),
        JSON.stringify(row["Net Salary"]),
      ];
      csvRows.push(values.join(","));
    }

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

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

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] mt-6">
      <div className="flex items-center justify-between px-4 py-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Payroll Details
        </h2>
        <button
          onClick={openModal}
          className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.05]"
        >
          + Add Payroll
        </button>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell className="px-5 py-3 text-start text-sm font-medium text-gray-500 dark:text-gray-400">
                Month
              </TableCell>
              <TableCell className="px-5 py-3 text-start text-sm font-medium text-gray-500 dark:text-gray-400">
                Basic Salary
              </TableCell>
              <TableCell className="px-5 py-3 text-start text-sm font-medium text-gray-500 dark:text-gray-400">
                Allowances
              </TableCell>
              <TableCell className="px-5 py-3 text-start text-sm font-medium text-gray-500 dark:text-gray-400">
                Deductions
              </TableCell>
              <TableCell className="px-5 py-3 text-start text-sm font-medium text-gray-500 dark:text-gray-400">
                Net Salary
              </TableCell>
              <TableCell className="px-5 py-3 text-start text-sm font-medium text-gray-500 dark:text-gray-400">
                Action
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {tableData?.map((payroll) => (
              <TableRow key={payroll.id}>
                <TableCell className="px-4 py-3 text-start text-sm text-gray-700 dark:text-gray-300">
                  {payroll.month}
                </TableCell>
                <TableCell className="px-4 py-3 text-start text-sm text-gray-700 dark:text-gray-300">
                  {payroll.basicSalary}
                </TableCell>
                <TableCell className="px-4 py-3 text-start text-sm text-gray-700 dark:text-gray-300">
                  {payroll.allowances}
                </TableCell>
                <TableCell className="px-4 py-3 text-start text-sm text-gray-700 dark:text-gray-300">
                  {payroll.deductions}
                </TableCell>
                <TableCell className="px-4 py-3 text-start text-sm text-gray-700 dark:text-gray-300">
                  {payroll.netSalary}
                </TableCell>
                <TableCell className="px-4 py-3 text-start text-sm text-gray-700 dark:text-gray-300">
                  {payroll.action}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <AddPayrollForm employeeId={Number(id)} />
      </Modal>
    </div>
  );
}
