import React, { useState } from "react";
import Input from "../input/InputField";
import TextArea from "../input/TextArea";
import Button from "../ui/button/Button";
import { useModal } from "../../hooks/useModal";
import Label from "../form/Label";
import { useSettingStore } from "../../store/settingStore";
import ComponentCard from "../common/ComponentCard";

export default function AddRegionForm() {
  const { closeModal } = useModal();
  const { addRegion, error } = useSettingStore((state) => state);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTextAreaChange = (value: string) => {
    setForm((prev) => ({ ...prev, description: value }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Region name is required.";
    return newErrors;
  };

  const handleRegionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      await addRegion({
        name: form.name,
        description: form.description.trim() || undefined,
      });

      closeModal();
    } catch (err) {
      console.error("Error adding region:", err);
    }
  };

  return (
    <ComponentCard title="Add Region" desc="">
      <form className="flex flex-col" onSubmit={handleRegionSubmit}>
        {error && (
          <h5 className="mb-5 text-lg font-medium text-red-400 dark:text-white/90 lg:mb-6">
            {error}
          </h5>
        )}

        <div className="grid grid-cols-1 gap-x-6 gap-y-5">
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
              onChange={handleTextAreaChange}
              error={false}
              hint=""
            />
          </div>
        </div>

        <div className="flex items-center gap-3 px-2 mt-6 justify-end">
          <Button size="sm" variant="outline" onClick={closeModal}>
            Cancel
          </Button>
          <Button size="sm">Create Region</Button>
        </div>
      </form>
    </ComponentCard>
  );
}
