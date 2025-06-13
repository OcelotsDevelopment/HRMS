import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { useUserStore } from "../../store/userStore.ts";
import { useEffect, useState } from "react";
import { Modal } from "../../components/ui/modal";
import UserTable from "../../components/user/table/UserTable.tsx";
import EditUserForm from "../../components/user/form/EditUserForm.tsx";
import AddUserForm from "../../components/user/form/AddUserForm";

export default function ListUser() {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [userId, setUserId] = useState<number>();

  const { users } = useUserStore();

  useEffect(() => {
    if (users) {
      setOpen(false);
      setOpenEdit(false);
    }
  }, [users]);

  return (
    <>
      <PageMeta title="User Management" description="List of system users" />
      <PageBreadcrumb pageTitle="User Table" />
      <div className="space-y-6">
        <ComponentCard
          title="User Table"
          buttonTitle="Add User"
          handleButtonClick={() => setOpen(true)}
        >
          <UserTable
            openModal={(id) => {
              setUserId(id);
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
        <AddUserForm />
      </Modal>

      <Modal
        isOpen={openEdit}
        onClose={() => setOpenEdit(false)}
        className="max-w-[700px] m-4"
      >
        {userId !== undefined && <EditUserForm user={{ id: userId }} />}
      </Modal>
    </>
  );
}
