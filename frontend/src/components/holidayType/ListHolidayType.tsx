// ListHolidayType.tsx
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { useEffect, useState } from "react";
import { Modal } from "../../components/ui/modal";
import { useSettingStore } from "../../store/settingStore";
import HolidayTypeTable from "./HolidayTypeTable";
import AddHolidayTypeForm from "./AddHolidayTypeForm";
import EditHolidayTypeForm from "./EditHolidayTypeForm";

export default function ListHolidayType() {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [holidayTypeId, setHolidayTypeId] = useState<number>();

  const { holidayTypes, fetchHolidayTypes } = useSettingStore();

  useEffect(() => {
    fetchHolidayTypes();
  }, [fetchHolidayTypes]);

  useEffect(() => {
    if (holidayTypes) {
      setOpen(false);
      setOpenEdit(false);
    }
  }, [holidayTypes]);

  return (
    <>
      <PageMeta title="Holiday Type Management" description="List of holiday types" />
      <PageBreadcrumb pageTitle="Holiday Types" />
      <div className="space-y-6">
        <ComponentCard
          title="Holiday Types"
          buttonTitle="Add Holiday Type"
          handleButtonClick={() => setOpen(true)}
        >
          <HolidayTypeTable
            openModal={(id) => {
              setHolidayTypeId(id);
              setOpenEdit(true);
            }}
          />
        </ComponentCard>
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)} className="max-w-[600px] m-4">
        <AddHolidayTypeForm />
      </Modal>

      <Modal isOpen={openEdit} onClose={() => setOpenEdit(false)} className="max-w-[600px] m-4">
        {holidayTypeId !== undefined && <EditHolidayTypeForm holidayTypeId={holidayTypeId} />}
      </Modal>
    </>
  );
}
