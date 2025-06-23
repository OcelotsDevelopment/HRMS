import { useEffect, useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Input from "../../input/InputField";
import Label from "../../form-elements/Label";
import { useAttendanceStore } from "../../../store/attendanceStore";
import { useEmployeeStore } from "../../../store/employeeStore";

export default function AddManualAttendanceForm() {
  const [employeeId, setEmployeeId] = useState<number | "">("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const [errors, setErrors] = useState<{
    employeeId?: string;
    checkIn?: string;
    checkOut?: string;
  }>({});

  const { employees, fetchEmployees } = useEmployeeStore();
  const addDailyAttendance = useAttendanceStore((state) => state.addDaily);
  const error = useAttendanceStore((state) => state.error);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

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

    await addDailyAttendance({
      employeeId: Number(employeeId),
      checkIn,
      checkOut,
      date: checkIn.split("T")[0], // just in case backend wants it
      status: "PRESENT",
      source: "MANUAL",
    });

    // Reset
    setEmployeeId("");
    setCheckIn("");
    setCheckOut("");
  };

  return (
    <ComponentCard title="Manual Attendance Entry">
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
          Submit Attendance
        </button>
      </form>
    </ComponentCard>
  );
}
