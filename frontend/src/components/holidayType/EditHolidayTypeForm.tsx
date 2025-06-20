import { useEffect, useState } from "react";
import Input from "../input/InputField";
import Button from "../ui/button/Button";
import Label from "../form/Label";
import ComponentCard from "../common/ComponentCard";
import { useModal } from "../../hooks/useModal";
import { useSettingStore } from "../../store/settingStore";

interface EditHolidayTypeFormProps {
  holidayTypeId: number;
}

export default function EditHolidayTypeForm({ holidayTypeId }: EditHolidayTypeFormProps) {
  const { closeModal } = useModal();
  const {
    getHolidayTypeById,
    updateHolidayType,
    selectedHolidayType,
    error,
  } = useSettingStore();

  const [form, setForm] = useState({ name: "" });
  const [errors, setErrors] = useState<{ name?: string }>({});

  // Fetch holiday type by ID on mount
  useEffect(() => {
    if (holidayTypeId) getHolidayTypeById(holidayTypeId);
  }, [getHolidayTypeById, holidayTypeId]);

  // Set form when selectedHolidayType is available
  useEffect(() => {
    if (selectedHolidayType) {
      setForm({ name: selectedHolidayType.name || "" });
    }
  }, [selectedHolidayType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!form.name.trim()) newErrors.name = "Holiday Type name is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await updateHolidayType(holidayTypeId, { name: form.name.trim() });
      closeModal();
    } catch (err) {
      console.error("Update Holiday Type Error:", err);
    }
  };

  return (
    <ComponentCard title="Edit Holiday Type" desc="">
      <form className="flex flex-col" onSubmit={handleSubmit}>
        {error && (
          <h5 className="mb-5 text-lg font-medium text-red-400 dark:text-white/90 lg:mb-6">
            {error}
          </h5>
        )}
        <div className="grid grid-cols-1 gap-6">
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

        <div className="flex items-center gap-3 mt-6 justify-end">
          <Button size="sm" variant="outline" onClick={closeModal}>
            Cancel
          </Button>
          <Button size="sm">Update Holiday Type</Button>
        </div>
      </form>
    </ComponentCard>
  );
}
