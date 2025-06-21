import { useEffect, useState } from "react";
import Input from "../../input/InputField";
import TextArea from "../../input/TextArea";
import Button from "../../ui/button/Button";
import Label from "../../form/Label";
import { useEmployeeStore } from "../../../store/employeeStore"; // Assuming you have this for dropdown
import { useWorkforceStore } from "../../../store/workforceStore";
import { useModal } from "../../../hooks/useModal";
import ComponentCard from "../../common/ComponentCard";

export default function AddLeaveForm() {
  const { closeModal } = useModal();
  const { addLeave, error } = useWorkforceStore();
  const { employees, fetchEmployees } = useEmployeeStore();

  const [form, setForm] = useState({
    title: "",
    description: "",
    leaveDate: "",
    isPaid: true,
    employeeId: 0,
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
    if (!form.title.trim()) newErrors.title = "Leave title is required.";
    if (!form.leaveDate.trim()) newErrors.leaveDate = "Leave date is required.";
    if (!form.employeeId) newErrors.employeeId = "Please select an employee.";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      await addLeave({
        ...form,
        employeeId: Number(form.employeeId),
        leaveDate: new Date(form.leaveDate).toISOString(),
      });
      closeModal();
    } catch (err) {
      console.error("Error adding leave:", err);
    }
  };

  return (
    <ComponentCard title="Add Leave" desc="">
      <form className="flex flex-col" onSubmit={handleSubmit}>
        {error && (
          <h5 className="mb-4 text-sm font-medium text-red-500 dark:text-white/90">
            {error}
          </h5>
        )}

        <div className="grid grid-cols-1 gap-y-5">
          <div>
            <Label>Leave Title</Label>
            <Input
              type="text"
              name="title"
              placeholder="Enter leave title"
              value={form.title}
              onChange={handleChange}
              error={!!errors.title}
              hint={errors.title}
            />
          </div>

          <div>
            <Label>Leave Date</Label>
            <Input
              type="date"
              name="leaveDate"
              value={form.leaveDate}
              onChange={handleChange}
              error={!!errors.leaveDate}
              hint={errors.leaveDate}
            />
          </div>

          <div>
            <Label>Employee</Label>
            <select
              name="employeeId"
              value={form.employeeId}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
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
              Paid Leave
            </Label>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button size="sm" variant="outline" onClick={closeModal}>
            Cancel
          </Button>
          <Button size="sm">Create Leave</Button>
        </div>
      </form>
    </ComponentCard>
  );
}
