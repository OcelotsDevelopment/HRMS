// pages/region/ListRegion.tsx
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { useEffect, useState } from "react";
import { Modal } from "../../components/ui/modal";
import RegionTable from "../../components/region/RegionTable";
import AddRegionForm from "./AddRegionForm";
import { useSettingStore } from "../../store/settingStore";
import EditRegionForm from "./EditRegionForm";

export default function ListRegion() {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [regionId, setRegionId] = useState<number>();

  const { regions, fetchRegions } = useSettingStore();

  useEffect(() => {
    fetchRegions();
  }, [fetchRegions]);

  useEffect(() => {
    if (regions) {
      setOpen(false);
      setOpenEdit(false);
    }
  }, [regions]);

  return (
    <>
      <PageMeta title="Region Management" description="List of company regions" />
      <PageBreadcrumb pageTitle="Region Table" />
      <div className="space-y-6">
        <ComponentCard
          title="Region Table"
          buttonTitle="Add Region"
          handleButtonClick={() => setOpen(true)}
        >
          <RegionTable
            openModal={(id) => {
              setRegionId(id);
              setOpenEdit(true);
            }}
          />
        </ComponentCard>
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)} className="max-w-[600px] m-4">
        <AddRegionForm />
      </Modal>

      <Modal isOpen={openEdit} onClose={() => setOpenEdit(false)} className="max-w-[600px] m-4">
        {regionId !== undefined && <EditRegionForm regionId={regionId} />}
      </Modal>
    </>
  );
}
