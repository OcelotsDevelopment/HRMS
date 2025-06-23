import PageMeta from "../../common/PageMeta";
import PageBreadcrumb from "../../common/PageBreadCrumb";
import ComponentCard from "../../common/ComponentCard";
import { useEffect, useState } from "react";
import { Modal } from "../../ui/modal";
import { useAttendanceStore } from "../../../store/attendanceStore";
import AttendanceLogTable from "./AttendanceLogTable";
// import AddAttendanceLogForm from "./AddAttendanceLogForm";
import EditAttendanceLogForm from "./EditAttendanceLogForm";
import AddManualAttendanceForm from "./AddManualAttendanceForm";

export default function ListAttendanceLog() {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [logId, setLogId] = useState<string>();

  const { fetchLogs, logs } = useAttendanceStore();

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    if (logs) {
      setOpen(false);
      setOpenEdit(false);
    }
  }, [logs]);

  return (
    <>
      <PageMeta title="Attendance Logs" description="View attendance punches" />
      <PageBreadcrumb pageTitle="Attendance Logs Table" />
      <div className="space-y-6">
        <ComponentCard
          title="Attendance Log Table"
          buttonTitle="Add Log"
          handleButtonClick={() => setOpen(true)}
        >
          <AttendanceLogTable
            openModal={(id) => {
              setLogId(id);
              setOpenEdit(true);
            }}
          />
        </ComponentCard>
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)} className="max-w-[600px] m-4">
        <AddManualAttendanceForm />
      </Modal>

      <Modal isOpen={openEdit} onClose={() => setOpenEdit(false)} className="max-w-[600px] m-4">
        {logId && <EditAttendanceLogForm id={logId} />}
      </Modal>
    </>
  );
}
