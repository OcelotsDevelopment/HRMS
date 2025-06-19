// EditQualificationForm.tsx
import React, { useEffect, useState } from "react";
import Label from "../../../../form/Label";
import Input from "../../../../input/InputField";
import Button from "../../../../ui/button/Button";
import { useModal } from "../../../../../hooks/useModal";
import { useEmployeeStore } from "../../../../../store/employeeStore";

interface EditQualificationFormProps {
  qualificationId: number;
  onSuccess?: () => void;
}

export default function EditQualificationForm({
  qualificationId,
  onSuccess,
}: EditQualificationFormProps) {
  const { closeModal } = useModal();

  const [form, setForm] = useState({
    id: 0,
    standard: "",
    fromYear: "",
    toYear: "",
    percentage: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const {
    error,
    updateQualification,
    selectedQualification,
    getQualificationById,
    Updatequalification,
  } = useEmployeeStore((state) => state);

  useEffect(() => {
    getQualificationById(qualificationId);
  }, [qualificationId, getQualificationById]);

  useEffect(() => {
    if (selectedQualification) {
      setForm({
        id: selectedQualification.id || 0,
        standard: selectedQualification.standard || "",
        fromYear: selectedQualification.fromYear.toString() || "",
        toYear: selectedQualification.toYear.toString() || "",
        percentage: selectedQualification.percentage?.toString() || "",
      });
    }
  }, [selectedQualification]);

  useEffect(() => {
    if (Updatequalification) {
      closeModal();
      // onSuccess();
      if (onSuccess) onSuccess();
    }
  }, [Updatequalification,closeModal,onSuccess]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.standard.trim()) newErrors.standard = "Standard is required.";
    if (!form.fromYear.trim()) newErrors.fromYear = "From Year is required.";
    if (!form.toYear.trim()) newErrors.toYear = "To Year is required.";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      await updateQualification(qualificationId, {
        standard: form.standard,
        fromYear: parseInt(form.fromYear),
        toYear: parseInt(form.toYear),
        percentage: form.percentage ? parseFloat(form.percentage) : undefined,
      });

      // if (onSuccess) onSuccess();
      // closeModal();
    } catch (err) {
      console.error("Error updating qualification:", err);
    }
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
        Edit Qualification
      </h5>
      {error && <p className="text-red-400">{error}</p>}
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
        <div>
          <Label>Standard</Label>
          <Input
            type="text"
            name="standard"
            placeholder="e.g. Bachelor's in CS"
            value={form.standard}
            onChange={handleChange}
            error={!!errors.standard}
            hint={errors.standard || ""}
          />
        </div>
        <div>
          <Label>From Year</Label>
          <Input
            type="number"
            name="fromYear"
            placeholder="e.g. 2018"
            value={form.fromYear}
            onChange={handleChange}
            error={!!errors.fromYear}
            hint={errors.fromYear || ""}
          />
        </div>
        <div>
          <Label>To Year</Label>
          <Input
            type="number"
            name="toYear"
            placeholder="e.g. 2022"
            value={form.toYear}
            onChange={handleChange}
            error={!!errors.toYear}
            hint={errors.toYear || ""}
          />
        </div>
        <div>
          <Label>Percentage</Label>
          <Input
            type="number"
            name="percentage"
            placeholder="e.g. 85.5"
            value={form.percentage}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="flex items-center gap-3 px-2 mt-6 justify-end">
        <Button size="sm" variant="outline" onClick={closeModal}>
          Cancel
        </Button>
        <Button size="sm">Update Qualification</Button>
      </div>
    </form>
  );
}
