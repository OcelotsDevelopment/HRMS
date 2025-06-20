import React, { useState } from "react";
import Input from "../input/InputField";
import Button from "../ui/button/Button";
import { useModal } from "../../hooks/useModal";
import Label from "../form/Label";
import { useSettingStore } from "../../store/settingStore";
import ComponentCard from "../common/ComponentCard";

export default function AddHolidayTypeForm() {
  const { closeModal } = useModal();
  const { addHolidayType, error } = useSettingStore();

  const [form, setForm] = useState({ name: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Holiday Type name is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await addHolidayType({ name: form.name.trim() });
      closeModal();
    } catch (err) {
      console.error("Error adding holiday type:", err);
    }
  };

  return (
    <ComponentCard title="Add Holiday Type" desc="">
      <form className="flex flex-col" onSubmit={handleSubmit}>
        {error && (
          <h5 className="mb-5 text-lg font-medium text-red-400 dark:text-white/90 lg:mb-6">
            {error}
          </h5>
        )}

        <div className="grid grid-cols-1 gap-x-6 gap-y-5">
          <div>
            <Label>Holiday Type Name</Label>
            <Input
              type="text"
              name="name"
              placeholder="Enter holiday type name"
              value={form.name}
              onChange={handleChange}
              error={!!errors.name}
              hint={errors.name || ""}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 px-2 mt-6 justify-end">
          <Button size="sm" variant="outline" onClick={closeModal}>
            Cancel
          </Button>
          <Button size="sm">Create Holiday Type</Button>
        </div>
      </form>
    </ComponentCard>
  );
}
