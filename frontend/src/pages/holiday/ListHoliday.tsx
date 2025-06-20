// pages/holiday/ListHoliday.tsx
import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { Modal } from "../../components/ui/modal";

import HolidayTable from "../../components/holiday/HolidayTable";
import AddHolidayForm from "../../components/holiday/AddHolidayForm";
import EditHolidayForm from "../../components/holiday/EditHolidayForm";
import { useWorkforceStore } from "../../store/workforceStore";

export default function ListHoliday() {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [holidayId, setHolidayId] = useState<number>();

  const { holidays, fetchHolidays } = useWorkforceStore();

  useEffect(() => {
    fetchHolidays();
  }, [fetchHolidays]);

  useEffect(() => {
    if (holidays) {
      setOpen(false);
      setOpenEdit(false);
    }
  }, [holidays]);

  return (
    <>
      <PageMeta title="Holiday Management" description="List of holidays" />
      <PageBreadcrumb pageTitle="Holiday Table" />
      <div className="space-y-6">
        <ComponentCard
          title="Holiday Table"
          buttonTitle="Add Holiday"
          handleButtonClick={() => setOpen(true)}
        >
          <HolidayTable
            openModal={(id) => {
              setHolidayId(id);
              setOpenEdit(true);
            }}
          />
        </ComponentCard>
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)} className="max-w-[700px] m-4">
        <AddHolidayForm />
      </Modal>

      <Modal isOpen={openEdit} onClose={() => setOpenEdit(false)} className="max-w-[700px] m-4">
        {holidayId !== undefined && <EditHolidayForm holidayId={holidayId} />}
      </Modal>
    </>
  );
}
