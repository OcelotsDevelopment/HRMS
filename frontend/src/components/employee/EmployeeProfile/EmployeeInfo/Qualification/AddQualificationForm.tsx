// AddQualificationForm.tsx
import React, { useEffect, useState } from "react";
import Label from "../../../../form/Label";
import Input from "../../../../input/InputField";
import Button from "../../../../ui/button/Button";
import { useModal } from "../../../../../hooks/useModal";
import { useParams } from "react-router-dom";
import { useEmployeeStore } from "../../../../../store/employeeStore";

const AddQualificationForm = () => {
  const { id } = useParams();
  const { closeModal } = useModal();
  const {addQualification,error,Addqualification} = useEmployeeStore((state) => state);

  const [form, setForm] = useState({
    standard: "",
    fromYear: "",
    toYear: "",
    percentage: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});


  useEffect(()=>{
    if(Addqualification){
        closeModal()
    }
  },[Addqualification,closeModal]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.standard.trim()) errs.standard = "Standard is required.";
    if (!form.fromYear.trim()) errs.fromYear = "From year is required.";
    if (!form.toYear.trim()) errs.toYear = "To year is required.";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    if (!id) return alert("Invalid Employee ID");

    await addQualification({
      employeeId: Number(id),
      standard: form.standard,
      fromYear: Number(form.fromYear),
      toYear: Number(form.toYear),
      percentage: form.percentage ? Number(form.percentage) : undefined,
    });
    closeModal()
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
      <h5 className="text-lg font-semibold text-gray-800 dark:text-white">
        Add Qualification
      </h5>
         {error && <p className="text-red-400">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <div>
          <Label>Standard</Label>
          <Input
            name="standard"
            value={form.standard}
            onChange={handleChange}
            placeholder="e.g. B.E"
            error={!!errors.standard}
            hint={errors.standard}
          />
        </div>
        <div>
          <Label>From Year</Label>
          <Input
            name="fromYear"
            type="number"
            value={form.fromYear}
            onChange={handleChange}
            placeholder="e.g. 2015"
            error={!!errors.fromYear}
            hint={errors.fromYear}
          />
        </div>
        <div>
          <Label>To Year</Label>
          <Input
            name="toYear"
            type="number"
            value={form.toYear}
            onChange={handleChange}
            placeholder="e.g. 2019"
            error={!!errors.toYear}
            hint={errors.toYear}
          />
        </div>
        <div>
          <Label>Percentage</Label>
          <Input
            name="percentage"
            type="number"
            value={form.percentage}
            onChange={handleChange}
            placeholder="e.g. 78"
          />
        </div>
      </div>
      <div className="flex justify-end gap-3">
        {/* <Button variant="outline" onClick={closeModal}>
          Cancel
        </Button> */}
        <Button>Save Qualification</Button>
      </div>
    </form>
  );
};

export default AddQualificationForm;
