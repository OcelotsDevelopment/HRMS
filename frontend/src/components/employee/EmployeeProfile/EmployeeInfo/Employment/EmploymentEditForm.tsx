// EditEmploymentForm.tsx
import React, { useEffect, useState } from "react";
import Label from "../../../../form/Label";
import Input from "../../../../input/InputField";
import TextArea from "../../../../input/TextArea";
import Button from "../../../../ui/button/Button";
import { useModal } from "../../../../../hooks/useModal";
import { useEmployeeStore } from "../../../../../store/employeeStore";

interface EditEmploymentFormProps {
  employmentId: number;
  onSuccess?: () => void;
}

export default function EditEmploymentForm({
  employmentId,
  onSuccess,
}: EditEmploymentFormProps) {
  const { closeModal } = useModal();
  const fetchEmploymentById = useEmployeeStore(
    (state) => state.getEmploymentById
  );
  const updateEmployment = useEmployeeStore((state) => state.updateEmployment);
  const selectedEmployment = useEmployeeStore(
    (state) => state.selectedEmployment
  );

  const [form, setForm] = useState({
    id: 0,
    employerName: "",
    positionHeld: "",
    location: "",
    workedFrom: "",
    workedTill: "",
    lastSalaryDrawn: "",
    reasonForLeaving: "",
    remarks: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchEmploymentById(employmentId);
  }, [employmentId, fetchEmploymentById]);

  useEffect(() => {
    if (selectedEmployment) {
      setForm({
        id: selectedEmployment.id || 0,
        employerName: selectedEmployment.employerName || "",
        positionHeld: selectedEmployment.positionHeld || "",
        location: selectedEmployment.location || "",
        workedFrom:
          selectedEmployment.workedFrom?.substring(0, 10) || "",
        workedTill:
          selectedEmployment.workedTill?.substring(0, 10) || "",
        lastSalaryDrawn:
          selectedEmployment.lastSalaryDrawn?.toString() || "",
        reasonForLeaving:
          selectedEmployment.reasonForLeaving || "",
        remarks: selectedEmployment.remarks || "",
      });
    }
  }, [selectedEmployment]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTextareaChange = (value: string) => {
    setForm((prev) => ({ ...prev, remarks: value }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.employerName.trim())
      newErrors.employerName = "Employer Name is required.";
    if (!form.positionHeld.trim())
      newErrors.positionHeld = "Position Held is required.";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      await updateEmployment(employmentId, {
        ...form,
        lastSalaryDrawn: form.lastSalaryDrawn
          ? Number(form.lastSalaryDrawn)
          : undefined,
        workedFrom: form.workedFrom,
        workedTill: form.workedTill,
      });
      if (onSuccess) onSuccess();
      closeModal();
    } catch (err) {
      console.error("Error updating employment:", err);
    }
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
        Edit Employment Details
      </h5>

      <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
        <div>
          <Label>Employer Name</Label>
          <Input
            type="text"
            name="employerName"
            placeholder="Enter employer name"
            value={form.employerName}
            onChange={handleChange}
            error={!!errors.employerName}
            hint={errors.employerName || ""}
          />
        </div>
        <div>
          <Label>Position Held</Label>
          <Input
            type="text"
            name="positionHeld"
            placeholder="Enter position held"
            value={form.positionHeld}
            onChange={handleChange}
            error={!!errors.positionHeld}
            hint={errors.positionHeld || ""}
          />
        </div>
        <div>
          <Label>Location</Label>
          <Input
            type="text"
            name="location"
            placeholder="Enter location"
            value={form.location}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label>Worked From</Label>
          <Input
            type="date"
            name="workedFrom"
            placeholder="Start date"
            value={form.workedFrom}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label>Worked Till</Label>
          <Input
            type="date"
            name="workedTill"
            placeholder="End date"
            value={form.workedTill}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label>Last Salary Drawn</Label>
          <Input
            type="number"
            name="lastSalaryDrawn"
            placeholder="Enter salary"
            value={form.lastSalaryDrawn}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label>Reason for Leaving</Label>
          <Input
            type="text"
            name="reasonForLeaving"
            placeholder="Enter reason for leaving"
            value={form.reasonForLeaving}
            onChange={handleChange}
          />
        </div>
        <div className="col-span-1 sm:col-span-2">
          <Label>Remarks</Label>
          <TextArea
            placeholder="Additional comments"
            value={form.remarks}
            onChange={handleTextareaChange}
            error={false}
            hint={""}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 px-2 mt-6 justify-end">
        <Button size="sm" variant="outline" onClick={closeModal}>
          Cancel
        </Button>
        <Button size="sm">Update Employment</Button>
      </div>
    </form>
  );
}
