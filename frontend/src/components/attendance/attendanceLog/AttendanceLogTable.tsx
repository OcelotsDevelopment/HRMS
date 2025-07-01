import { useEffect, useState, type JSX } from "react";
import DataTable from "../../common/DataTable";
import Badge from "../../ui/badge/Badge"; // Adjust path as needed
import { useAttendanceStore } from "../../../store/attendanceStore";

type AttendanceLogRow = {
  id?: string;
  timestamp: string;
  punchType: JSX.Element;
  source: JSX.Element;
  employeeName?: string;
  action?: JSX.Element;
};

interface AttendanceLogTableProps {
  openModal: (id: string) => void;
}

export default function AttendanceLogTable({
  openModal,
}: AttendanceLogTableProps) {
  const { logs } = useAttendanceStore();
  const [tableData, setTableData] = useState<AttendanceLogRow[]>([]);

  useEffect(() => {
    if (logs) {
      const formatted: AttendanceLogRow[] = logs.map((log) => ({
        id: log.id,
        timestamp: new Date(log.timestamp).toLocaleString(),
        punchType: (
          <Badge
            color={log.punchType === "IN" ? "success" : "warning"}
            size="sm"
          >
            {log.punchType}
          </Badge>
        ),
        source: (
          <Badge
            color={log.source === "BIOMETRIC" ? "success" : "warning"}
            size="sm"
          >
            {log.source}
          </Badge>
        ),
        employeeName: log.employee?.name ?? "—",
        action: (
          <button
           onClick={() => openModal(log.id!)} 
            className="flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
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
        ),
      }));

      setTableData(formatted);
    }
  }, [logs, openModal]);

  const columns: {
    key: keyof AttendanceLogRow;
    label: string;
    isAction?: boolean;
  }[] = [
    { key: "employeeName", label: "Employee" },
    { key: "timestamp", label: "Timestamp" },
    { key: "punchType", label: "Punch Type" },
    { key: "source", label: "Source" },
    { key: "action", label: "Action", isAction: true },
  ];

  return (
    <DataTable<AttendanceLogRow>
      columns={columns}
      rows={tableData}
      renderActions={(row) => row.action ?? <></>}
    />
  );
}
