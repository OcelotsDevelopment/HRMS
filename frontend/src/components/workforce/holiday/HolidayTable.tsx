// components/holiday/HolidayTable.tsx
import { useEffect, useState } from "react";
import { useWorkforceStore } from "../../../store/workforceStore";
import DataTable from "../../common/DataTable";
import { type JSX } from "react";

type HolidayRow = {
  id: number;
  title: string;
  date: string;
  isPaid: boolean;
  holidayTypeName?: string;
  regionName?: string;
  action?: JSX.Element;
};

interface HolidayTableProps {
  openModal: (id: number) => void;
}

export default function HolidayTable({ openModal }: HolidayTableProps) {
  const { holidays } = useWorkforceStore();
  const [tableData, setTableData] = useState<HolidayRow[]>([]);

  useEffect(() => {
    if (holidays) {
      setTableData(
        holidays.map((item) => ({
          id: item.id,
          title: item.title,
          date: new Date(item.date).toLocaleDateString(),
          isPaid: item.isPaid,
          holidayTypeName: item.title ?? "—",
          regionName: item.title ?? "—",
          action: (
            <button
              onClick={() => openModal(item.id)}
              className="flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
            >
              Edit
            </button>
          ),
        }))
      );
    }
  }, [holidays, openModal]);

  const columns: {
    key: keyof HolidayRow;
    label: string;
    isAction?: boolean;
  }[] = [
    { key: "title", label: "Title" },
    { key: "date", label: "Date" },
    { key: "isPaid", label: "Paid" },
    { key: "holidayTypeName", label: "Type" },
    { key: "regionName", label: "Region" },
    { key: "action", label: "Action", isAction: true },
  ];

  return (
    <DataTable<HolidayRow>
      columns={columns}
      rows={tableData}
      renderActions={(row) => row.action ?? <></>}
    />
  );
}