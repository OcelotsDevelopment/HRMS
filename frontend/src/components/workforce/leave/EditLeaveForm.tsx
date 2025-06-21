import { useEffect, useState } from "react";
import Input from "../../input/InputField";
import TextArea from "../../input/TextArea";
import Button from "../../ui/button/Button";
import { useEmployeeStore } from "../../../store/employeeStore";
import Label from "../../form/Label";
import ComponentCard from "../../common/ComponentCard";
import { useModal } from "../../../hooks/useModal";
import { useWorkforceStore } from "../../../store/workforceStore";

interface EditLeaveFormProps {
  leaveId: number;
}

export default function EditLeaveForm({ leaveId }: EditLeaveFormProps) {
  const { closeModal } = useModal();
  const { getLeaveById, updateLeave, selectedLeave, error } =
    useWorkforceStore();

  const { fetchEmployees, employees } = useEmployeeStore();

  const [form, setForm] = useState<{
    title: string;
    description: string;
    leaveDate: string;
    isPaid: boolean;
    employeeId: number;
    status: "Pending" | "Approved" | "Rejected";
  }>({
    title: "",
    description: "",
    leaveDate: "",
    isPaid: true,
    employeeId: 0,
    status: "Pending",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    getLeaveById(leaveId);
    fetchEmployees();
  }, [leaveId,fetchEmployees,getLeaveById]);

  useEffect(() => {
    if (selectedLeave) {
      setForm({
        title: selectedLeave.title,
        description: selectedLeave.description ?? "",
        leaveDate: selectedLeave.leaveDate.slice(0, 10),
        isPaid: selectedLeave.isPaid,
        employeeId: selectedLeave.employeeId,
        status: selectedLeave.status,
      });
    }
  }, [selectedLeave]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.title.trim()) newErrors.title = "Leave title is required.";
    if (!form.leaveDate.trim()) newErrors.leaveDate = "Leave date is required.";
    if (!form.employeeId) newErrors.employeeId = "Employee is required.";
    return newErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, type, value, checked } = e.target as HTMLInputElement;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTextAreaChange = (val: string) => {
    setForm((prev) => ({ ...prev, description: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      await updateLeave(leaveId, {
        ...form,
        leaveDate: new Date(form.leaveDate).toISOString(),
      });
      closeModal();
    } catch (err) {
      console.error("Error updating leave:", err);
    }
  };

  return (
    <ComponentCard title="Edit Leave" desc="">
      <form className="flex flex-col" onSubmit={handleSubmit}>
        {error && (
          <h5 className="mb-5 text-sm font-medium text-red-500 dark:text-white/90">
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
            <Label>Date</Label>
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
              className="w-full border rounded px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value={0}>Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
            {errors.employeeId && (
              <p className="text-sm text-red-500 mt-1">{errors.employeeId}</p>
            )}
          </div>

          <div>
            <Label>Status</Label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <div>
            <Label>Description</Label>
            <TextArea
              value={form.description}
              onChange={handleTextAreaChange}
              error={false}
              hint=""
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="isPaid"
              type="checkbox"
              name="isPaid"
              checked={form.isPaid}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <Label
              htmlFor="isPaid"
              className="text-sm text-gray-700 dark:text-white"
            >
              Paid Leave
            </Label>
          </div>
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
