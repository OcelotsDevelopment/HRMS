import { useEffect, useState, type JSX } from "react";
import DataTable from "../../common/DataTable";
import Badge from "../../ui/badge/Badge"; 
import { useAttendanceStore } from "../../../store/attendanceStore";

type DailyAttendanceRow = {
  id?: string;
  employeeName?: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  totalHours?: string;
  otHours?: string;
  status: JSX.Element;
  // action?: JSX.Element;
};

interface DailyAttendanceTableProps {
  openModal: (id: string) => void;
}

export default function DailyAttendanceTable({
  openModal,
}: DailyAttendanceTableProps) {
  const { dailyAttendance } = useAttendanceStore();
  const [tableData, setTableData] = useState<DailyAttendanceRow[]>([]);

  useEffect(() => {
    if (dailyAttendance) {
      const formatted: DailyAttendanceRow[] = dailyAttendance.map((entry) => ({
        id: entry.id,
        employeeName: entry.employee?.name ?? entry.User?.name ?? "—",
        date: new Date(entry.date).toLocaleDateString(),
        checkIn: entry.checkIn ? new Date(entry.checkIn).toLocaleTimeString() : "—",
        checkOut: entry.checkOut ? new Date(entry.checkOut).toLocaleTimeString() : "—",
        totalHours: entry.totalHours?.toFixed(2) ?? "0.00",
        otHours: entry.otHours?.toFixed(2) ?? "0.00",
        status: (
          <Badge
            color={
              entry.status === "PRESENT"
                ? "success"
                : entry.status === "HALF_DAY"
                ? "warning"
                : "error"
            }
            size="sm"
          >
            {entry.status}
          </Badge>
        ),
        // action: (
        //   <button
        //     onClick={() => openModal(entry.id)}
        //     className="flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
        //   >
        //     Edit
        //   </button>
        // ),
      }));

      setTableData(formatted);
    }
  }, [dailyAttendance, openModal]);

  const columns: {
    key: keyof DailyAttendanceRow;
    label: string;
    isAction?: boolean;
  }[] = [
    { key: "employeeName", label: "Employee" },
    { key: "date", label: "Date" },
    { key: "checkIn", label: "Check In" },
    { key: "checkOut", label: "Check Out" },
    { key: "totalHours", label: "Total Hours" },
    { key: "otHours", label: "OT Hours" },
    { key: "status", label: "Status" },
    // { key: "action", label: "Action", isAction: true },
  ];

  return (
    <DataTable<DailyAttendanceRow>
      columns={columns}
      rows={tableData}
      // renderActions={(row) => row.action ?? <></>}
    />
  );
}