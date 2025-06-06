import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import DepartmentTable from "../../components/department/table/DepartmentTable";
import { useEffect, useState } from "react";
import { Modal } from "../../components/ui/modal";
import AddDepartmentForm from "../../components/department/form/AddForm";
import { useDepartmentStore } from "../../store/departmentStore";
import EditDepartmentForm from "../../components/department/form/EditDepartmentForm";

export default function ListDepartment() {
  const [open, setOpen] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [departmentId, setDepartmentId] = useState<number>();

  const departments = useDepartmentStore((state) => state.departments);
  

  useEffect(() => {
    if (departments) {
      setOpen(false);
      setOpenEdit(false);
    }
  }, [departments]);

  return (
    <>
      <PageMeta
        title="Department Management"
        description="This is Department page for HRMS"
      />
      <PageBreadcrumb pageTitle="Department Table" />
      <div className="space-y-6">
        <ComponentCard
          title="Department Table"
          buttonTitle="Add Department"
          handleButtonClick={() => setOpen(true)}
        >
          <DepartmentTable
            openModal={(id) => {
              setOpenEdit(true);
              setDepartmentId(id);
            }}
          />
        </ComponentCard>
      </div>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        className="max-w-[700px] m-4"
      >
        {/* <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11"> */}
        <AddDepartmentForm />
        {/* </div> */}
      </Modal>

      <Modal
        isOpen={openEdit}
        onClose={() => setOpenEdit(false)}
        className="max-w-[700px] m-4"
      >
        {departmentId !== undefined && (
          <EditDepartmentForm department={{ id: departmentId }} />
        )}
      </Modal>
    </>
  );
}
