import { useEffect, useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import { Modal } from "../../../components/ui/modal";
import { useWorkforceStore } from "../../../store/workforceStore";
import CompOffTable from "../../../components/workforce/leave/CompOffTable";
import AddCompOffForm from "../../../components/workforce/leave/AddCompOffForm";
import EditCompOffForm from "../../../components/workforce/leave/EditCompOffForm";

export default function ListCompOff() {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { compOffs, fetchCompOffs } = useWorkforceStore();

  useEffect(() => {
    fetchCompOffs();
  }, [fetchCompOffs]);

  const handleEdit = (id: number) => {
    setSelectedId(id);
    setOpenEdit(true);
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <ComponentCard
        title="Compensatory Off Requests"
        buttonTitle="Add Comp Off"
        handleButtonClick={() => setOpen(true)}
      >
        <CompOffTable
          compOffs={compOffs}
          openModal={(id: number) => handleEdit(id)}
        />
      </ComponentCard>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        className="max-w-[700px] m-4"
      >
        <AddCompOffForm />
      </Modal>

      <Modal
        isOpen={openEdit}
        onClose={() => setOpenEdit(false)}
        className="max-w-[700px] m-4"
      >
        {selectedId !== null && <EditCompOffForm compOffId={selectedId} />}
      </Modal>
    </div>
  );
}
