import { useCallback, useEffect, useState, type JSX } from "react";
import DataTable from "../../common/DataTable";
import Badge from "../../ui/badge/Badge";
import type { CompOff } from "../../../types/leaveType";
import { useWorkforceStore } from "../../../store/workforceStore";

type CompOffRow = {
  id: number;
  employeeName?: string;
  workedFrom: string;
  workedTo: string;
  daysGranted: number;
  status: JSX.Element;
  action?: JSX.Element;
};

interface Props {
  compOffs: CompOff[];
  openModal: (id: number) => void;
}

export default function CompOffTable({ compOffs, openModal }: Props) {
  const [tableData, setTableData] = useState<CompOffRow[]>([]);
  const { updateCompOffStatus } = useWorkforceStore();

  const handleStatusChange = useCallback(
    (id: number, newStatus: string) => {
      updateCompOffStatus(
        id,
        newStatus as "PENDING" | "APPROVED" | "REJECTED" | "USED"
      );
    },
    [updateCompOffStatus]
  );

  useEffect(() => {
    if (compOffs && Array.isArray(compOffs)) {
      const formatted: CompOffRow[] = compOffs.map((item) => ({
        id: item.id,
        employeeName: item.employee?.name ?? "—",
        workedFrom: new Date(item.workedFrom).toLocaleDateString(),
        workedTo: new Date(item.workedTo).toLocaleDateString(),
        daysGranted: item.daysGranted,
        status: (
          <div className="flex items-center gap-2">
            <Badge
              size="sm"
              color={
                item.status === "APPROVED"
                  ? "success"
                  : item.status === "REJECTED"
                  ? "error"
                  : item.status === "USED"
                  ? "warning"
                  : "warning"
              }
            >
              {item.status}
            </Badge>
            <select
              value={item.status}
              onChange={(e) => handleStatusChange(item.id, e.target.value)}
              className="rounded border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="USED">Used</option>
            </select>
          </div>
        ),
        action: (
          <button
            onClick={() => openModal(item.id)}
            className="flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            Edit
          </button>
        ),
      }));

      setTableData(formatted);
    }
  }, [compOffs, handleStatusChange, openModal]);

  // const columns = [
  //   { key: "employeeName", label: "Employee" },
  //   { key: "workedFrom", label: "Worked From" },
  //   { key: "workedTo", label: "Worked To" },
  //   { key: "daysGranted", label: "Days Granted" },
  //   { key: "status", label: "Status" },
  //   { key: "action", label: "Action", isAction: true },
  // ];

  const columns: {
    key: keyof CompOffRow;
    label: string;
    isAction?: boolean;
  }[] = [
    { key: "employeeName", label: "Employee" },
    { key: "workedFrom", label: "Worked From" },
    { key: "workedTo", label: "Worked To" },
    { key: "daysGranted", label: "Days Granted" },
    { key: "status", label: "Status" },
    { key: "action", label: "Action", isAction: true },
  ];

  return (
    <DataTable<CompOffRow>
      columns={columns}
      rows={tableData}
      renderActions={(row) => row.action ?? <></>}
    />
  );
}
