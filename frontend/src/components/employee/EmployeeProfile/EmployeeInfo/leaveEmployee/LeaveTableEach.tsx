import { useEffect, useState, type JSX } from "react";
import DataTable from "../../../../common/DataTable";
import { useWorkforceStore } from "../../../../../store/workforceStore";
import Badge from "../../../../ui/badge/Badge";

type LeaveRow = {
  id: number;
  title: string;
  type: string;
  from: string;
  to: string;
  status: JSX.Element;
  employeeName?: string;
  appliedByName?: string;
  action?: JSX.Element;
};

interface LeaveTableProps {
  openModal: (id: number) => void;
}

export default function LeaveTableEach({ openModal }: LeaveTableProps) {
  const { leavesEach } = useWorkforceStore();
  const [tableData, setTableData] = useState<LeaveRow[]>([]);

  useEffect(() => {
    if (leavesEach && Array.isArray(leavesEach)) {
      const formatted: LeaveRow[] = leavesEach.map((item) => ({
        id: item.id,
        title: item.title,
        type: item.type || "—",
        from: new Date(item.from).toLocaleDateString(),
        to: new Date(item.to).toLocaleDateString(),
        status: (
          <Badge
            size="sm"
            color={
              item.status.toUpperCase() === "APPROVED"
                ? "success"
                : item.status.toUpperCase() === "PENDING"
                ? "warning"
                : "error"
            }
          >
            {item.status}
          </Badge>
        ),
        employeeName: item.employee?.name ?? "—",
        appliedByName:
          item.appliedByEmployee?.name ?? item.appliedByUser?.name ?? "—",
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
  }, [openModal,leavesEach]);

  const columns: {
    key: keyof LeaveRow;
    label: string;
    isAction?: boolean;
  }[] = [
    { key: "title", label: "Title" },
    { key: "type", label: "Type" },
    { key: "from", label: "From" },
    { key: "to", label: "To" },
    { key: "status", label: "Status" },
    { key: "employeeName", label: "Leave For" },
    { key: "appliedByName", label: "Applied By" },
    { key: "action", label: "Action", isAction: true },
  ];

  return (
    <DataTable<LeaveRow>
      columns={columns}
      rows={tableData}
      renderActions={(row) => row.action ?? <></>}
    />
  );
}
