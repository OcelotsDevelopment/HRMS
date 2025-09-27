import { useEffect, useState } from "react";
import PageMeta from "../../common/PageMeta";
import PageBreadcrumb from "../../common/PageBreadCrumb";
import ComponentCard from "../../common/ComponentCard";
import { Modal } from "../../ui/modal";
import { useAttendanceStore } from "../../../store/attendanceStore";
import DailyAttendanceTable from "./DailyAttendanceTable";
import EditDailyAttendanceForm from "./EditDailyAttendanceForm";
import Loader from "../../common/Loader";

export default function ListDailyAttendance() {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { fetchDailyAttendance, dailyAttendance, total,loading } = useAttendanceStore();

  const [page, setPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const limit = 10;
  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
      fetchDailyAttendance({
        date: selectedDate.toISOString().split("T")[0],
        page,
        limit,
      });
  }, [selectedDate, page,fetchDailyAttendance]);

  useEffect(() => {
    if (dailyAttendance) {
      setOpen(false);
      setSelectedId(null);
    }
  }, [dailyAttendance]);

    // Conditional render loader
  if (loading) return <Loader />;

  return (
    <>
      <PageMeta
        title="Daily Attendance"
        description="Summary of daily attendance per employee"
      />
      <PageBreadcrumb pageTitle="Daily Attendance Table" />
      <div className="space-y-6">
        <ComponentCard title="Daily Attendance Table">
          <DailyAttendanceTable
            openModal={(id) => {
              setSelectedId(id);
              setOpen(true);
            }}
            page={page}
            setPage={setPage}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            totalPages={totalPages}
          />
        </ComponentCard>
      </div>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        className="max-w-[600px] m-4"
      >
        {selectedId && <EditDailyAttendanceForm attendanceId={selectedId} />}
      </Modal>
    </>
  );
}
