import { useEffect, useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Input from "../../input/InputField";
import Label from "../../form-elements/Label";
import { useAttendanceStore } from "../../../store/attendanceStore";

interface EditDailyAttendanceFormProps {
  attendanceId: string; // DailyAttendance ID
}

export default function EditDailyAttendanceForm({ attendanceId }: EditDailyAttendanceFormProps) {
  const {
    getDailyById,
    selectedDaily,
    updateDaily,
    error,
  } = useAttendanceStore();

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [status, setStatus] = useState("PRESENT");

  const [errors, setErrors] = useState<{
    checkIn?: string;
    checkOut?: string;
  }>({});

  // Fetch attendance record on mount
  useEffect(() => {
    if (attendanceId) {
      getDailyById(attendanceId);
    }
  }, [attendanceId]);

  // Set state from fetched record
  useEffect(() => {
    if (selectedDaily) {
      setCheckIn(
        selectedDaily.dailyAttendance?.checkIn
          ? new Date(selectedDaily.dailyAttendance?.checkIn).toISOString().slice(0, 16)
          : ""
      );
      setCheckOut(
        selectedDaily.checkOut
          ? new Date(selectedDaily.checkOut).toISOString().slice(0, 16)
          : ""
      );
      setStatus(selectedDaily.status || "PRESENT");
    }
  }, [selectedDaily]);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!checkIn) newErrors.checkIn = "Check In is required.";
    if (!checkOut) newErrors.checkOut = "Check Out is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await updateDaily(attendanceId, {
      checkIn: new Date(checkIn).toISOString(),
      checkOut: new Date(checkOut).toISOString(),
      status,
    });
  };

  return (
    <ComponentCard title="Edit Daily Attendance">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <p className="text-red-500">{error}</p>}

        <div>
          <Label>Check In</Label>
          <Input
            type="datetime-local"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            error={!!errors.checkIn}
            hint={errors.checkIn || ""}
          />
        </div>

        <div>
          <Label>Check Out</Label>
          <Input
            type="datetime-local"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            error={!!errors.checkOut}
            hint={errors.checkOut || ""}
          />
        </div>

        <div>
          <Label>Status</Label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border rounded p-2 dark:bg-neutral-800"
          >
            <option value="PRESENT">PRESENT</option>
            <option value="HALF_DAY">HALF_DAY</option>
            <option value="ABSENT">ABSENT</option>
          </select>
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