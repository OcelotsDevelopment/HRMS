import PageMeta from "../../components/common/PageMeta.tsx";
import PageBreadcrumb from "../../components/common/PageBreadCrumb.tsx";
import ComponentCard from "../../components/common/ComponentCard.tsx";
import { useEmployeeStore } from "../../store/employeeStore.ts"; // Use new store
import { useEffect, useState } from "react";
import { Modal } from "../../components/ui/modal/index.tsx";
import EmployeeTable from "../../components/employee/EmployeeTable.tsx"; // Employee Table
import EditEmployeeForm from "../../components/employee/form/EditEmployeeForm.tsx"; // Edit Form
import AddEmployeeForm from "../../components/employee/form/AddEmployeeForm.tsx"; // Add Form

export default function ListEmployee() {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [employeeId, setEmployeeId] = useState<number>();

  const { employees, fetchEmployees } = useEmployeeStore();

  useEffect(() => {
    fetchEmployees(); // Fetch on mount
  }, [fetchEmployees]);

  useEffect(() => {
    if (employees) {
      setOpen(false);
      setOpenEdit(false);
    }
  }, [employees]);

  return (
    <>
      <PageMeta title="Employee Management" description="List of company employees" />
      <PageBreadcrumb pageTitle="Employee Table" />
      <div className="space-y-6">
        <ComponentCard
          title="Employee Table"
          buttonTitle="Add Employee"
          handleButtonClick={() => setOpen(true)}
        >
          <EmployeeTable
            openModal={(id) => {
              setEmployeeId(id);
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
        <AddEmployeeForm />
      </Modal>

      <Modal
        isOpen={openEdit}
        onClose={() => setOpenEdit(false)}
        className="max-w-[700px] m-4"
      >
        {employeeId !== undefined && <EditEmployeeForm employee={{ id: employeeId }} />}
      </Modal>
    </>
  );
}
