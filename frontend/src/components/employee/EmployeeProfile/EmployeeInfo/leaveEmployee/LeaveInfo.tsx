import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ComponentCard from "../../../../common/ComponentCard";
import { Modal } from "../../../../ui/modal";
import { useWorkforceStore } from "../../../../../store/workforceStore";

import LeaveTableEach from "./LeaveTableEach";
import AddLeaveEachForm from "./AddEachEmployee";
import EditLeaveEachForm from "./EditLeaveEachForm";

export default function LeaveInfo() {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [leaveId, setLeaveId] = useState<number>();

  const { id } = useParams();
  const { leaves, leaveBalanceEach, fetchLeavesEach } = useWorkforceStore();

  useEffect(() => {
    if (id) fetchLeavesEach(Number(id));
  }, [fetchLeavesEach, id]);

  useEffect(()=>{
    if(leaves){
      setOpen(false)
      setOpenEdit(false)
    }
  },[leaves])

  return (
    <>
      {/* Leave Balance Summary */}
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 mb-6">
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-4 text-sm">
          <div>
            <strong>Total Accrued:</strong>{" "}
            {leaveBalanceEach?.totalAccrued ?? "-"} days
          </div>
          <div>
            <strong>Total Used:</strong> {leaveBalanceEach?.totalUsed ?? "-"}{" "}
            days
          </div>
          <div>
            <strong>Remaining:</strong> {leaveBalanceEach?.remaining ?? "-"}{" "}
            days
          </div>
          <div>
            <strong>Remaining This Month:</strong>{" "}
            {leaveBalanceEach?.remainingThisMonth ?? "-"} days
          </div>
        </div>
      </div>

      {/* Leave Table */}
      <ComponentCard
        title="Leave Table"
        buttonTitle="Apply Leave"
        handleButtonClick={() => setOpen(true)}
      >
        <LeaveTableEach
          openModal={(id) => {
            setLeaveId(id);
            setOpenEdit(true);
          }}
        />
      </ComponentCard>

      {/* Add Leave Modal */}
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        className="max-w-[700px] m-4"
      >
        <AddLeaveEachForm />
      </Modal>

      {/* Edit Leave Modal */}
      <Modal
        isOpen={openEdit}
        onClose={() => setOpenEdit(false)}
        className="max-w-[700px] m-4"
      >
        {leaveId !== undefined && <EditLeaveEachForm leaveId={leaveId} />}
      </Modal>
    </>
  );
}
