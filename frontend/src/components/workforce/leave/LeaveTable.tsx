import { useEffect, useState } from "react";
import { type JSX } from "react";
import DataTable from "../../common/DataTable";
import { useWorkforceStore } from "../../../store/workforceStore";

type LeaveRow = {
  id: number;
  title: string;
  date: string;
  status: string;
  employeeName?: string;
  appliedByName?: string;
  action?: JSX.Element;
};

interface LeaveTableProps {
  openModal: (id: number) => void;
}

export default function LeaveTable({ openModal }: LeaveTableProps) {
  const { leaves } = useWorkforceStore();
  const [tableData, setTableData] = useState<LeaveRow[]>([]);

  useEffect(() => {
    if (leaves) {

      console.log(leaves,"leelelelelleleelleelelelelleel");
      
      const formatted: LeaveRow[] = leaves?.map((item) => ({
        id: item.id,
        title: item.title,
        date: new Date(item.leaveDate).toLocaleDateString(),
        status: item.status,
        employeeName: item.employee?.name ?? "—",
        appliedByName: item?.title || item?.title || "—",
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
  }, [leaves, openModal]);

  const columns: {
    key: keyof LeaveRow;
    label: string;
    isAction?: boolean;
  }[] = [
    { key: "title", label: "Title" },
    { key: "date", label: "Date" },
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
