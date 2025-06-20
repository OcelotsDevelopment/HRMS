// components/holidayType/HolidayTypeTable.tsx
import { useEffect, useState,type JSX } from "react";
import DataTable from "../common/DataTable";
import { useSettingStore } from "../../store/settingStore";

// types.ts
export type HolidayType = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};


type HolidayTypeRow = HolidayType & { action?: JSX.Element };

interface HolidayTypeTableProps {
  openModal: (id: number) => void;
}

export default function HolidayTypeTable({ openModal }: HolidayTypeTableProps) {
  const { holidayTypes, fetchHolidayTypes } = useSettingStore();
  const [tableData, setTableData] = useState<HolidayTypeRow[]>([]);

  useEffect(() => {
    fetchHolidayTypes();
  }, [fetchHolidayTypes]);

  useEffect(() => {
    if (holidayTypes) {
        console.log(holidayTypes,"holidayTypesholidayTypesholidayTypes");
        
      const formatted: HolidayTypeRow[] = holidayTypes?.map((item) => ({
        ...item,
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
  }, [holidayTypes, openModal]);

const columns: { key: keyof HolidayTypeRow; label: string; isAction?: boolean }[] = [
  { key: "name", label: "Holiday Type Name" },
  { key: "action", label: "Action", isAction: true },
];


  return (
    <DataTable<HolidayTypeRow>
      columns={columns}
      rows={tableData}
      renderActions={(row) => row.action ?? <></>}
    />
  );
}
