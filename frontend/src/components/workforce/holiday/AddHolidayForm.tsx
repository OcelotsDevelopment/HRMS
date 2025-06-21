import { useState, useEffect } from "react";
import Input from "../../input/InputField";
import TextArea from "../../input/TextArea";
import Button from "../../ui/button/Button";
import Label from "../../form/Label";
import { useModal } from "../../../hooks/useModal";
import ComponentCard from "../../common/ComponentCard";
import { useWorkforceStore } from "../../../store/workforceStore";
import { useSettingStore } from "../../../store/settingStore";

export default function AddHolidayForm() {
  const { closeModal } = useModal();
  const { addHoliday, error,addSuccessHoliday } = useWorkforceStore();
  const { holidayTypes, fetchHolidayTypes, regions, fetchRegions } =
    useSettingStore();

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    isPaid: true,
    holidayTypeId: 0,
    regionId: undefined as number | undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchHolidayTypes();
    fetchRegions();
  }, [fetchHolidayTypes, fetchRegions]);

  useEffect(()=>{
    if(addSuccessHoliday){
      closeModal()
    }
  },[addSuccessHoliday,closeModal])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, type } = target;
    const value = type === "checkbox" ? target.checked : target.value;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTextAreaChange = (val: string) => {
    setForm((prev) => ({ ...prev, description: val }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.title.trim()) newErrors.title = "Holiday title is required.";
    if (!form.date.trim()) newErrors.date = "Holiday date is required.";
    if (!form.holidayTypeId)
      newErrors.holidayTypeId = "Holiday type is required.";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      await addHoliday({
        ...form,
        holidayTypeId: Number(form.holidayTypeId),
        regionId: form.regionId ? Number(form.regionId) : undefined,
        date: new Date(form.date).toISOString(),
      });
      closeModal();
    } catch (err) {
      console.error("Error adding holiday:", err);
    }
  };

  return (
    <ComponentCard title="Add Holiday" desc="">
      <form className="flex flex-col" onSubmit={handleSubmit}>
        {error && (
          <h5 className="mb-5 text-lg font-medium text-red-500 dark:text-white/90">
            {error}
          </h5>
        )}

        <div className="grid grid-cols-1 gap-y-5">
          <div>
            <Label>Title</Label>
            <Input
              type="text"
              name="title"
              placeholder="Enter holiday title"
              value={form.title}
              onChange={handleChange}
              error={!!errors.title}
              hint={errors.title}
            />
          </div>

          <div>
            <Label>Date</Label>
            <Input
              type="date"
              name="date"
              value={form.date}
              // onChange={handleChange}
               onChange={(e) =>
                setForm((prev) => ({ ...prev, date: e.target.value }))
              }
              error={!!errors.date}
              hint={errors.date}
            />
          </div>

          <div>
            <Label>Holiday Type</Label>
            <select
              name="holidayTypeId"
              value={form.holidayTypeId}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value={0}>Select Holiday Type</option>
              {holidayTypes?.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            {errors.holidayTypeId && (
              <p className="mt-1 text-sm text-red-500">
                {errors.holidayTypeId}
              </p>
            )}
          </div>

          <div>
            <Label>Region (Optional)</Label>
            <select
              name="regionId"
              value={form.regionId ?? ""}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="">Select Region</option>
              {regions?.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Description</Label>
            <TextArea
              placeholder="Optional description"
              value={form.description}
              onChange={handleTextAreaChange}
              error={false}
              hint=""
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="isPaid"
              name="isPaid"
              type="checkbox"
              checked={form.isPaid}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <Label
              htmlFor="isPaid"
              className="text-sm text-gray-700 dark:text-white"
            >
              Paid Holiday
            </Label>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          {/* <Button size="sm" variant="outline" onClick={closeModal}>
            Cancel
          </Button> */}
          <Button size="sm">Create Holiday</Button>
        </div>
      </form>
    </ComponentCard>
  );
}
