import { useEffect, useState } from "react";
import Input from "../../input/InputField";
import TextArea from "../../input/TextArea";
import Button from "../../ui/button/Button";
import Label from "../../form/Label";
import ComponentCard from "../../common/ComponentCard";
import { useModal } from "../../../hooks/useModal";
import { useEmployeeStore } from "../../../store/employeeStore";
import { useWorkforceStore } from "../../../store/workforceStore";

interface EditCompOffFormProps {
  compOffId: number;
}

export default function EditCompOffForm({ compOffId }: EditCompOffFormProps) {
  const { closeModal } = useModal();
  const { getCompOffById, updateCompOff, selectedCompOff, error } =
    useWorkforceStore();
  const { fetchEmployees, employees } = useEmployeeStore();

  const [form, setForm] = useState({
  title: "",
  employeeId: 0,
  workedFrom: "",
  workedTo: "",
  reason: "",
  daysGranted: "",
  status: "PENDING" as "PENDING" | "APPROVED" | "REJECTED" | "USED",
});


  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    getCompOffById(compOffId);
    fetchEmployees();
  }, [compOffId, getCompOffById, fetchEmployees]);

  useEffect(() => {
    if (selectedCompOff) {
      console.log(selectedCompOff, "selectedCompOff");

      setForm({
        title: selectedCompOff.title || "",
        employeeId: selectedCompOff.employeeId,
        workedFrom: selectedCompOff.workedFrom?.slice(0, 10) || "",
        workedTo: selectedCompOff.workedTo?.slice(0, 10) || "",
        reason: selectedCompOff.reason || "",
        daysGranted: selectedCompOff.daysGranted?.toString() || "1",
        status: selectedCompOff.status || "PENDING",
      });
    }
  }, [selectedCompOff]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.employeeId) newErrors.employeeId = "Employee is required.";
    if (!form.workedFrom.trim())
      newErrors.workedFrom = "Worked From date is required.";
    if (!form.workedTo.trim())
      newErrors.workedTo = "Worked To date is required.";
    if (!form.daysGranted.trim())
      newErrors.daysGranted = "Days granted is required.";
    return newErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      await updateCompOff(compOffId, {
        ...form,
        employeeId: Number(form.employeeId),
        daysGranted: Number(form.daysGranted),
        workedFrom: new Date(form.workedFrom).toISOString(),
        workedTo: new Date(form.workedTo).toISOString(),
      });
      closeModal();
    } catch (err) {
      console.error("Error updating Comp Off:", err);
    }
  };

  return (
    <ComponentCard title="Edit Compensatory Off">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
        {error && (
          <p className="text-sm text-red-500 dark:text-white/90">{error}</p>
        )}

        <div>
          <Label>Employee</Label>
          <select
            name="employeeId"
            value={form.employeeId}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
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

        <div className="grid grid-cols-2 gap-4">
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
        </div>

        <div>
          <Label>Days Granted</Label>
          <Input
            type="number"
            name="daysGranted"
            value={form.daysGranted}
            onChange={handleChange}
            error={!!errors.daysGranted}
            hint={errors.daysGranted}
          />
        </div>

        <div>
          <Label>Status</Label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="USED">Used</option>
          </select>
        </div>

        <div>
          <Label>Reason</Label>
          <TextArea
            placeholder="Optional reason"
            value={form.reason}
            onChange={(val) => setForm((prev) => ({ ...prev, reason: val }))}
            error={false}
            hint=""
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button size="sm" variant="outline" onClick={closeModal}>
            Cancel
          </Button>
          <Button size="sm">Update Comp Off</Button>
        </div>
      </form>
    </ComponentCard>
  );
}
