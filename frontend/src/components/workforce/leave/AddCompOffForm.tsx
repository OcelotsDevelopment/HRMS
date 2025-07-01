import { useEffect, useState } from "react";
import Input from "../../input/InputField";
import TextArea from "../../input/TextArea";
import Button from "../../ui/button/Button";
import Label from "../../form/Label";
import { useEmployeeStore } from "../../../store/employeeStore";
import { useWorkforceStore } from "../../../store/workforceStore";
import { useModal } from "../../../hooks/useModal";
import ComponentCard from "../../common/ComponentCard";

export default function AddCompOffForm() {
  const { closeModal } = useModal();
  const { addCompOff, error } = useWorkforceStore();
  const { employees, fetchEmployees } = useEmployeeStore();

  const [form, setForm] = useState({
    title: "",
    employeeId: 0,
    workedFrom: "",
    workedTo: "",
    reason: "",
    daysGranted: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.employeeId || Number(form.employeeId) === 0)
      newErrors.employeeId = "Please select an employee.";
    if (!form.title.trim()) newErrors.title = "Title is required.";
    if (!form.workedFrom.trim())
      newErrors.workedFrom = "Worked From date is required.";
    if (!form.workedTo.trim())
      newErrors.workedTo = "Worked To date is required.";
    if (!form.daysGranted.trim())
      newErrors.daysGranted = "Days granted is required.";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      await addCompOff({
        ...form,
        employeeId: Number(form.employeeId),
        daysGranted: Number(form.daysGranted),
        workedFrom: new Date(form.workedFrom).toISOString(),
        workedTo: new Date(form.workedTo).toISOString(),
      });
      closeModal();
    } catch (err) {
      console.error("Error creating comp off:", err);
    }
  };

  return (
    <ComponentCard title="Add Compensatory Off">
      <form className="flex flex-col" onSubmit={handleSubmit}>
        {error && (
          <h5 className="mb-4 text-sm font-medium text-red-500 dark:text-white/90">
            {error}
          </h5>
        )}

        <div className="grid grid-cols-1 gap-y-5">
          <div>
            <Label>Title</Label>
            <Input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              error={!!errors.title}
              hint={errors.title}
            />
          </div>

          <div>
            <Label>Employee</Label>
            <select
              name="employeeId"
              value={form.employeeId}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value={0}>Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
            {errors.employeeId && (
              <p className="mt-1 text-sm text-red-500">{errors.employeeId}</p>
            )}
          </div>

          <div>
            <Label>Worked From</Label>
            <Input
              type="date"
              name="workedFrom"
              value={form.workedFrom}
              onChange={handleChange}
              error={!!errors.workedFrom}
              hint={errors.workedFrom}
            />
          </div>

          <div>
            <Label>Worked To</Label>
            <Input
              type="date"
              name="workedTo"
              value={form.workedTo}
              onChange={handleChange}
              error={!!errors.workedTo}
              hint={errors.workedTo}
            />
          </div>

          <div>
            <Label>Days Granted</Label>
            <Input
              type="number"
              name="daysGranted"
              placeholder="e.g. 1 or 2"
              value={form.daysGranted}
              onChange={handleChange}
              error={!!errors.daysGranted}
              hint={errors.daysGranted}
            />
          </div>

          <div>
            <Label>Reason</Label>
            <TextArea
              //   name="reason"
              value={form.reason}
              onChange={(val) => setForm((prev) => ({ ...prev, reason: val }))}
              placeholder="Optional reason"
              error={false}
              hint=""
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          {/* <Button size="sm" variant="outline" onClick={closeModal}>
            Cancel
          </Button> */}
          <Button size="sm">Create Comp Off</Button>
        </div>
      </form>
    </ComponentCard>
  );
}
