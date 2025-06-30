import { useEffect, useState } from "react";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import { Modal } from "../../../components/ui/modal";

import { useWorkforceStore } from "../../../store/workforceStore";
import LeaveTable from "../../../components/workforce/leave/LeaveTable";
import AddLeaveForm from "../../../components/workforce/leave/AddLeaveForm";
import EditLeaveForm from "../../../components/workforce/leave/EditLeaveForm";
import PaginationControls from "../../../components/ui/pagination/PaginationControls";

export default function ListLeave() {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [leaveId, setLeaveId] = useState<number>();
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");

  const { leaves, fetchLeaves, totalPages } = useWorkforceStore();

  useEffect(() => {
    fetchLeaves(currentPage, statusFilter);
  }, [currentPage, statusFilter]);

  useEffect(() => {
    setOpen(false);
    setOpenEdit(false);
  }, [leaves]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Reset to first page on filter change
  };

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
          {/* Filter Dropdown */}
          <div className="mb-4 flex items-center justify-end">
            <select
              value={statusFilter}
              onChange={handleStatusChange}
              className="rounded border px-3 py-1 text-sm dark:bg-gray-800 dark:text-white"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          {/* Table */}
          <LeaveTable
            openModal={(id) => {
              setLeaveId(id);
              setOpenEdit(true);
            }}
          />

          {/* Pagination */}
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </ComponentCard>
      </div>

      {/* Modals */}
      <Modal isOpen={open} onClose={() => setOpen(false)} className="max-w-[700px] m-4">
        <AddLeaveForm />
      </Modal>

      <Modal isOpen={openEdit} onClose={() => setOpenEdit(false)} className="max-w-[700px] m-4">
        {leaveId !== undefined && <EditLeaveForm leaveId={leaveId} />}
      </Modal>
    </>
  );
}
