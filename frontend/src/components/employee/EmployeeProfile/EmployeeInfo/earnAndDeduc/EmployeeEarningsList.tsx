import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import DataTable, { type Column } from "../../../../common/DataTable.tsx";
import ComponentCard from "../../../../common/ComponentCard.tsx";
import { useEmployeeStore } from "../../../../../store/employeeStore.ts";

// Define the actual row structure you will pass to DataTable
type FormattedEarningsRow = {
  cycle: string;
  baseSalary: string;
  incentives: string;
  deductions: string;
  netPay: string;
  workingDays: string;
  leaveDays: string;
};

export default function EmployeeEarningsList() {
  const { id } = useParams();
  const employeeId = useMemo(() => Number(id), [id]);

  const { earningsSummary, fetchEarningsSummary } = useEmployeeStore();

  useEffect(() => {
    if (employeeId) {
      fetchEarningsSummary(employeeId);
    }
  }, [employeeId, fetchEarningsSummary]);

  const columns: Column<FormattedEarningsRow>[] = [
    { key: "cycle", label: "Cycle" },
    { key: "baseSalary", label: "Base Salary" },
    { key: "incentives", label: "Incentives" },
    { key: "deductions", label: "Deductions" },
    { key: "netPay", label: "Net Pay" },
    { key: "workingDays", label: "Working Days" },
    { key: "leaveDays", label: "Leave Days" },
  ];

  const formattedSummary: FormattedEarningsRow[] = earningsSummary?.map((row) => ({
    cycle: row.cycle,
    baseSalary: `₹${row.baseSalary}`,
    incentives: `₹${row.incentives}`,
    deductions: `₹${row.deductions}`,
    netPay: `₹${row.netPay}`,
    workingDays: row.workingDays.toString(),
    leaveDays: row.leaveDays.toString(),
  }));

  return (
    <div className="space-y-6">
      <ComponentCard title="Earnings & Deductions Breakdown">
        <DataTable columns={columns} rows={formattedSummary} />
      </ComponentCard>
    </div>
  );
}
