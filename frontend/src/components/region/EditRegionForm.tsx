import { useEffect, useState } from "react";
import Input from "../input/InputField";
import TextArea from "../input/TextArea";
import Button from "../ui/button/Button";
import { useModal } from "../../hooks/useModal";
import { useSettingStore } from "../../store/settingStore";
import Label from "../form/Label";
import ComponentCard from "../common/ComponentCard";

interface EditRegionFormProps {
  regionId: number;
}


export default function EditRegionForm({ regionId }: EditRegionFormProps) {
  const { closeModal } = useModal();
  const { getRegionById, updateRegion, selectedRegion,error } = useSettingStore();

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [errors, setErrors] = useState<{ name?: string }>({});

  useEffect(() => {
    if (regionId) {
      getRegionById(regionId);
    }
  }, [getRegionById,regionId]);

  useEffect(() => {
    if (selectedRegion) {
      setForm({
        name: selectedRegion.name || "",
        description: selectedRegion.description || "",
      });
    }
  }, [selectedRegion]);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!form.name.trim()) newErrors.name = "Region name is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await updateRegion(regionId, form);
      closeModal();
    } catch (err) {
      console.error("Update Region Error:", err);
    }
  };

  return (
    <ComponentCard title="Edit Region" desc="">
    <form className="flex flex-col" onSubmit={handleSubmit}>
     {error && (
          <h5 className="mb-5 text-lg font-medium text-red-400 dark:text-white/90 lg:mb-6">
            {error}
          </h5>
        )}

      <div className="grid grid-cols-1 gap-6">
        <div>
          <Label>Region Name</Label>
          <Input
            type="text"
            name="name"
            placeholder="Enter region name"
            value={form.name}
            onChange={handleChange}
            error={!!errors.name}
            hint={errors.name || ""}
          />
        </div>

        <div>
          <Label>Description</Label>
          <TextArea
            // name="description"
            placeholder="Optional description"
            value={form.description}
            onChange={(val) => setForm((prev) => ({ ...prev, description: val }))}
            error={false}
            hint=""
          />
        </div>
      </div>

      <div className="flex items-center gap-3 mt-6 justify-end">
        <Button size="sm" variant="outline" onClick={closeModal}>
          Cancel
        </Button>
        <Button size="sm">
          Update Region
        </Button>
      </div>
    </form>
    </ComponentCard>
  );
}
