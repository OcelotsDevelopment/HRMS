import { useEffect, useState } from "react";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import { Modal } from "../../../components/ui/modal";

import { useWorkforceStore } from "../../../store/workforceStore";
import LeaveTable from "../../../components/workforce/leave/LeaveTable";
import AddLeaveForm from "../../../components/workforce/leave/AddLeaveForm";
import EditLeaveForm from "../../../components/workforce/leave/EditLeaveForm";

export default function ListLeave() {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [leaveId, setLeaveId] = useState<number>();

  const { leaves, fetchLeaves } = useWorkforceStore();

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  useEffect(() => {
    if (leaves) {
      setOpen(false);
      setOpenEdit(false);
    }
  }, [leaves]);

  return (
    <>
      <PageMeta title="Leave Management" description="Manage employee leaves" />
      <PageBreadcrumb pageTitle="Leave Table" />
      <div className="space-y-6">
        <ComponentCard
          title="Leave Table"
          buttonTitle="Apply Leave"
          handleButtonClick={() => setOpen(true)}
        >
          <LeaveTable
            openModal={(id) => {
              setLeaveId(id);
              setOpenEdit(true);
            }}
          />
        </ComponentCard>
      </div>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        className="max-w-[700px] m-4"
      >
        <AddLeaveForm />
      </Modal>

      <Modal
        isOpen={openEdit}
        onClose={() => setOpenEdit(false)}
        className="max-w-[700px] m-4"
      >
        {leaveId !== undefined && <EditLeaveForm leaveId={leaveId} />}
      </Modal>
    </>
  );
}
