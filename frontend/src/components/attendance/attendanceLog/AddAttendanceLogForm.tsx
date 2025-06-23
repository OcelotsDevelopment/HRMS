import { useEffect, useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Input from "../../input/InputField";
import Label from "../../form-elements/Label";
import { useAttendanceStore } from "../../../store/attendanceStore";
import { useEmployeeStore } from "../../../store/employeeStore";

export default function AddAttendanceLogForm() {
  const [employeeId, setEmployeeId] = useState<number | "">("");
  const [timestamp, setTimestamp] = useState("");
  const [punchType, setPunchType] = useState("IN");
  const [source, setSource] = useState("MANUAL");

  const [errors, setErrors] = useState<{
    employeeId?: string;
    timestamp?: string;
  }>({});

  const addAttendanceLog = useAttendanceStore((state) => state.addLog);
  const error = useAttendanceStore((state) => state.error);
  const { employees, fetchEmployees } = useEmployeeStore();

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!employeeId) newErrors.employeeId = "Employee ID is required.";
    if (!timestamp) newErrors.timestamp = "Timestamp is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const parsedDate = new Date(timestamp);

    console.log(parsedDate, "timestamptimestamptimestamptimestamp");

    if (isNaN(parsedDate.getTime())) {
      setErrors({ timestamp: "Invalid timestamp format." });
      return;
    }

    await addAttendanceLog({
      employeeId: Number(employeeId),
      timestamp: parsedDate.toISOString(),
      punchType,
      source,
    });

    // Reset fields
    setEmployeeId("");
    setTimestamp("");
    setPunchType("IN");
    setSource("MANUAL");
  };

  return (
    <ComponentCard title="Add Attendance Log">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <p className="text-red-500">{error}</p>}

        <div>
          <div>
            <Label>Employee</Label>
            <select
              name="employeeId"
              value={employeeId}
              onChange={(e) => setEmployeeId(Number(e.target.value))}
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
        </div>

        <div>
          <Label>Punch Timestamp</Label>
          <Input
            type="datetime-local"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
            placeholder="Select timestamp"
            error={!!errors.timestamp}
            hint={errors.timestamp || ""}
          />
        </div>

        <div>
          <Label>Punch Type</Label>
          <select
            value={punchType}
            onChange={(e) => setPunchType(e.target.value)}
            className="w-full border rounded p-2 dark:bg-neutral-800"
          >
            <option value="IN">IN</option>
            <option value="OUT">OUT</option>
          </select>
        </div>

        {/* <div>
          <Label>Source</Label>
          <select
            value={source}
            onChange={(e) => setSource("MANUAL")}
            className="w-full border rounded p-2 dark:bg-neutral-800"
          >
            <option value="MANUAL">MANUAL</option>
            <option value="BIOMETRIC">BIOMETRIC</option>
          </select>
        </div> */}

        <button
          type="submit"
          className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          Add Attendance Log
        </button>
      </form>
    </ComponentCard>
  );
}
