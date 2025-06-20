import { useEffect, useState } from "react";
import Input from "../input/InputField";
import TextArea from "../input/TextArea";
import Button from "../ui/button/Button";
import { useModal } from "../../hooks/useModal";
import { useWorkforceStore } from "../../store/workforceStore";
import { useSettingStore } from "../../store/settingStore";
import Label from "../form/Label";
import ComponentCard from "../common/ComponentCard";

interface EditHolidayFormProps {
  holidayId: number;
}

export default function EditHolidayForm({ holidayId }: EditHolidayFormProps) {
  const { closeModal } = useModal();
  const {
    getHolidayById,
    updateHoliday,
    selectedHoliday,
    error,
  } = useWorkforceStore();

  const { fetchRegions, regions, holidayTypes, fetchHolidayTypes } = useSettingStore();

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    isPaid: true,
    holidayTypeId: 0,
    regionId: 0,
  });

  const [errors, setErrors] = useState<{ title?: string; date?: string }>({});

  useEffect(() => {
    getHolidayById(holidayId);
    fetchRegions();
    fetchHolidayTypes();
  }, [holidayId]);

  useEffect(() => {
    if (selectedHoliday) {
      setForm({
        title: selectedHoliday.title,
        description: selectedHoliday.description ?? "",
        date: selectedHoliday.date.slice(0, 10),
        isPaid: selectedHoliday.isPaid,
        holidayTypeId: selectedHoliday.holidayTypeId,
        regionId: selectedHoliday.regionId || 0,
      });
    }
  }, [selectedHoliday]);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!form.title.trim()) newErrors.title = "Title is required.";
    if (!form.date) newErrors.date = "Date is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, type } = target;
    const value = type === "checkbox" ? target.checked : target.value;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await updateHoliday(holidayId, {
        ...form,
        holidayTypeId: Number(form.holidayTypeId),
        regionId: form.regionId ? Number(form.regionId) : undefined,
      });
      closeModal();
    } catch (err) {
      console.error("Update Holiday Error:", err);
    }
  };

  return (
    <ComponentCard title="Edit Holiday" desc="">
      <form className="flex flex-col" onSubmit={handleSubmit}>
        {error && (
          <h5 className="mb-5 text-lg font-medium text-red-400 dark:text-white/90">
            {error}
          </h5>
        )}

        <div className="grid grid-cols-1 gap-6">
          <div>
            <Label>Title</Label>
            <Input
              type="text"
              name="title"
              placeholder="Enter holiday title"
              value={form.title}
              onChange={handleChange}
              error={!!errors.title}
              hint={errors.title || ""}
            />
          </div>

          <div>
            <Label>Description</Label>
            <TextArea
              placeholder="Optional description"
              value={form.description}
              onChange={(val) =>
                setForm((prev) => ({ ...prev, description: val }))
              }
              error={false}
              hint=""
            />
          </div>

          <div>
            <Label>Date</Label>
            <Input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              error={!!errors.date}
              hint={errors.date || ""}
            />
          </div>

          <div>
            <Label>Is Paid</Label>
            <input
              type="checkbox"
              name="isPaid"
              checked={form.isPaid}
              onChange={handleChange}
              className="ml-2"
            />
          </div>

          <div>
            <Label>Holiday Type</Label>
            <select
              name="holidayTypeId"
              value={form.holidayTypeId}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              <option value="">Select Type</option>
              {holidayTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Region (Optional)</Label>
            <select
              name="regionId"
              value={form.regionId}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              <option value="">Select Region</option>
              {regions.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6 justify-end">
          <Button size="sm" variant="outline" onClick={closeModal}>
            Cancel
          </Button>
          <Button size="sm">Update Holiday</Button>
        </div>
      </form>
    </ComponentCard>
  );
}
