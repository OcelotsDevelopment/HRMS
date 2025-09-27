import { useEffect, useRef, useState, type JSX } from "react";
import { Calendar } from "lucide-react";
import DataTable from "../../common/DataTable";
import Badge from "../../ui/badge/Badge";
import PaginationControls from "../../ui/pagination/PaginationControls";
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
};

interface DailyAttendanceTableProps {
  openModal: (id: string) => void;
  page: number;
  setPage: (p: number) => void;
  selectedDate: Date;
  setSelectedDate: (d: Date) => void;
  totalPages: number;
}

export default function DailyAttendanceTable({
  // openModal,
  page,
  setPage,
  selectedDate,
  setSelectedDate,
  totalPages,
}: DailyAttendanceTableProps) {
  const { dailyAttendance } = useAttendanceStore();
  const [tableData, setTableData] = useState<DailyAttendanceRow[]>([]);

  {
    /* Date Filter */
  }
  const [filterDate, setFilterDate] = useState(
    selectedDate.toISOString().split("T")[0]
  );

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (dailyAttendance) {
      const formatted: DailyAttendanceRow[] = dailyAttendance.map((entry) => ({
        id: entry.id,
        employeeName: entry.employee?.name ?? entry.User?.name ?? "—",
        date: new Date(entry.date).toLocaleDateString(),
        checkIn: entry.checkIn
          ? new Date(entry.checkIn).toLocaleTimeString()
          : "—",
        checkOut: entry.checkOut
          ? new Date(entry.checkOut).toLocaleTimeString()
          : "—",
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
      }));

      setTableData(formatted);
    }
  }, [dailyAttendance]);

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
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <label htmlFor="date" className="font-medium whitespace-nowrap">
          Filter by Date:
        </label>

        <div className="relative">
          <input
            ref={inputRef}
            type="date"
            id="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border pl-10 pr-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <Calendar
            onClick={() => inputRef.current?.showPicker()} // ✅ opens calendar popup
            className="absolute left-2 top-2.5 h-5 w-5 text-gray-500 cursor-pointer"
          />
        </div>

        <button
          onClick={() => {
            setPage(1);
            setSelectedDate(new Date(filterDate));
          }}
          className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
        >
          Filter
        </button>
      </div>

      {/* No Data Fallback */}
      {tableData.length === 0 ? (
        <div className="text-center py-12">
          <img
            src="/images/error/no_found_attendance.png" 
            alt="No Data"
            className="mx-auto w-64 h-64"
          />
          <p className="text-gray-500 mt-4 text-lg">
            No attendance data found.
          </p>
        </div>
      ) : (
        <>
          <DataTable<DailyAttendanceRow> columns={columns} rows={tableData} />
          <PaginationControls
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
