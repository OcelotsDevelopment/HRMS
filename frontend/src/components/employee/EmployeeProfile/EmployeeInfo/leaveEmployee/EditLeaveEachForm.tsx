import { useEffect, useState } from "react";
import { useModal } from "../../../../../hooks/useModal";
import { useEmployeeStore } from "../../../../../store/employeeStore";
import { useWorkforceStore } from "../../../../../store/workforceStore";
import ComponentCard from "../../../../common/ComponentCard";
import Label from "../../../../form/Label";
import Input from "../../../../input/InputField";
import TextArea from "../../../../input/TextArea";
import Button from "../../../../ui/button/Button";

interface EditLeaveFormProps {
  leaveId: number;
}

export default function EditLeaveEachForm({ leaveId }: EditLeaveFormProps) {
  const { closeModal } = useModal();
  const { getLeaveById, updateLeave, selectedLeave, error } = useWorkforceStore();
  const { selectedEmployee } = useEmployeeStore();

  const [form, setForm] = useState({
    title: "",
    description: "",
    from: "",
    to: "",
    type: "CASUAL",
    isPaid: true,
    employeeId: 0,
    status: "Pending" as "Pending" | "Approved" | "Rejected",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    getLeaveById(leaveId);
  }, [leaveId, getLeaveById]);

  useEffect(() => {
    if (selectedLeave && selectedEmployee) {
      setForm({
        title: selectedLeave.title,
        description: selectedLeave.description || "",
        from: selectedLeave.from.slice(0, 10),
        to: selectedLeave.to.slice(0, 10),
        type: selectedLeave.type || "CASUAL",
        isPaid: selectedLeave.isPaid,
        employeeId: selectedEmployee.id, // force set to current employee
        status: selectedLeave.status,
      });
    }
  }, [selectedLeave, selectedEmployee]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.title.trim()) newErrors.title = "Leave title is required.";
    if (!form.from.trim()) newErrors.from = "From date is required.";
    if (!form.to.trim()) newErrors.to = "To date is required.";
    if (!form.employeeId) newErrors.employeeId = "Employee not found.";
    return newErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      await updateLeave(leaveId, {
        ...form,
        from: new Date(form.from).toISOString(),
        to: new Date(form.to).toISOString(),
      });
      closeModal();
    } catch (err) {
      console.error("Error updating leave:", err);
    }
  };

  return (
    <ComponentCard title="Edit Leave">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
        {error && (
          <p className="text-sm text-red-500 dark:text-white/90">{error}</p>
        )}

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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>From</Label>
            <Input
              type="date"
              name="from"
              value={form.from}
              onChange={handleChange}
              error={!!errors.from}
              hint={errors.from}
            />
          </div>
          <div>
            <Label>To</Label>
            <Input
              type="date"
              name="to"
              value={form.to}
              onChange={handleChange}
              error={!!errors.to}
              hint={errors.to}
            />
          </div>
        </div>

        <div>
          <Label>Type</Label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="CASUAL">Casual</option>
            <option value="SICK">Sick</option>
            <option value="EMERGENCY">Emergency</option>
            <option value="UNPAID">Unpaid</option>
            <option value="MATERNITY">Maternity</option>
          </select>
        </div>

        <div>
          <Label>Status</Label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* Display selected employee name for clarity */}
        <div className="text-sm text-gray-500 dark:text-white/70">
          Editing leave for: <span className="font-medium">{selectedEmployee?.name}</span>
        </div>

        <div>
          <Label>Description</Label>
          <TextArea
            placeholder="Description"
            value={form.description}
            onChange={(val) => setForm((prev) => ({ ...prev, description: val }))}
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
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <Label htmlFor="isPaid" className="text-sm text-gray-700 dark:text-white">
            Paid Leave
          </Label>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button size="sm" variant="outline" onClick={closeModal}>
            Cancel
          </Button>
          <Button size="sm">Update Leave</Button>
        </div>
      </form>
    </ComponentCard>
  );
}
