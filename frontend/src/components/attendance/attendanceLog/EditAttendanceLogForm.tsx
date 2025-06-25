import { useEffect, useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Input from "../../input/InputField";
import Label from "../../form-elements/Label";
import { useAttendanceStore } from "../../../store/attendanceStore";
import { useEmployeeStore } from "../../../store/employeeStore";

interface EditDailyAttendanceFormProps {
  id: string;
}

export default function EditDailyAttendanceForm({
  id,
}: EditDailyAttendanceFormProps) {
  const { getDailyById, selectedDaily, updateLog, error } =
    useAttendanceStore();

  const { employees, fetchEmployees } = useEmployeeStore();

  const [employeeId, setEmployeeId] = useState<number | "">("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const [errors, setErrors] = useState<{
    employeeId?: string;
    checkIn?: string;
    checkOut?: string;
  }>({});

  console.log(
    selectedDaily,
    "selectedDailyselectedDailyselectedDailyselectedDaily"
  );

  useEffect(() => {
    fetchEmployees();
    getDailyById(id);
  }, [id, fetchEmployees, getDailyById]);

  useEffect(() => {
    if (selectedDaily) {
      console.log(
        selectedDaily.employeeId,
        "selectedDaily.employeeIdselectedDaily.employeeIdselectedDaily.employeeIdselectedDaily.employeeId"
      );

      setEmployeeId(selectedDaily.employeeId);
      setCheckIn(selectedDaily.dailyAttendance?.checkIn?.slice(0, 16) || "");
      setCheckOut(selectedDaily.dailyAttendance?.checkOut?.slice(0, 16) || "");
    }
  }, [selectedDaily]);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!employeeId) newErrors.employeeId = "Employee is required.";
    if (!checkIn) newErrors.checkIn = "Check-in time is required.";
    if (!checkOut) newErrors.checkOut = "Check-out time is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await updateLog(id, {
      employeeId: Number(employeeId),
      checkIn,
      checkOut,
    });
  };

  return (
    <ComponentCard title="Edit Daily Attendance">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <p className="text-red-500">{error}</p>}

        <div>
          <Label>Employee</Label>
          <select
            value={employeeId}
            onChange={(e) => setEmployeeId(Number(e.target.value))}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="">Select Employee</option>
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
          <Label>Check-in Time</Label>
          <Input
            type="datetime-local"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            error={!!errors.checkIn}
            hint={errors.checkIn || ""}
          />
        </div>

        <div>
          <Label>Check-out Time</Label>
          <Input
            type="datetime-local"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            error={!!errors.checkOut}
            hint={errors.checkOut || ""}
          />
        </div>

        <button
          type="submit"
          className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          Update Attendance
        </button>
      </form>
    </ComponentCard>
  );
}
