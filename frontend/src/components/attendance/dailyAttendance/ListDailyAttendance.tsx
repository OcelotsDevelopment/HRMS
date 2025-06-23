import { useEffect, useState } from "react";
import PageMeta from "../../common/PageMeta";
import PageBreadcrumb from "../../common/PageBreadCrumb";
import ComponentCard from "../../common/ComponentCard";
import { Modal } from "../../ui/modal";
import { useAttendanceStore } from "../../../store/attendanceStore";
import DailyAttendanceTable from "./DailyAttendanceTable";
import EditDailyAttendanceForm from "./EditDailyAttendanceForm";

export default function ListDailyAttendance() {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { fetchDailyAttendance, dailyAttendance } = useAttendanceStore();

  useEffect(() => {
    fetchDailyAttendance();
  }, [fetchDailyAttendance]);

  useEffect(() => {
    if (dailyAttendance) {
      setOpen(false);
      setSelectedId(null);
    }
  }, [dailyAttendance]);

  return (
    <>
      <PageMeta title="Daily Attendance" description="Summary of daily attendance per employee" />
      <PageBreadcrumb pageTitle="Daily Attendance Table" />
      <div className="space-y-6">
        <ComponentCard title="Daily Attendance Table">
          <DailyAttendanceTable
            openModal={(id) => {
              setSelectedId(id);
              setOpen(true);
            }}
          />
        </ComponentCard>
      </div>

      {/* Optional: Modal to edit summary data */}
      <Modal isOpen={open} onClose={() => setOpen(false)} className="max-w-[600px] m-4">
        {/* Add your EditDailyAttendanceForm here if needed */}
        {selectedId && <EditDailyAttendanceForm attendanceId={selectedId} />}
      </Modal>
    </>
  );
}
