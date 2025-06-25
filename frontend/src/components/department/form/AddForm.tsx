import { useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Input from "../../input/InputField.tsx";
import Label from "../../form-elements/Label.tsx";
import { useDepartmentStore } from "../../../store/departmentStore.ts";

export default function AddDepartmentForm() {
  const [name, setName] = useState("");
  // const [headId, setHeadId] = useState(0);
  const [errors, setErrors] = useState<{ name?: string; headId?: string }>({});
  // const [successMessage, setSuccessMessage] = useState("");

  // state of department

  const addDepartment = useDepartmentStore((state) => state.addDepartment);


  const error = useDepartmentStore((state) => state.error);


  const validate = () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = "Department name is required.";
    // if (!headId.trim()) newErrors.headId = "Head ID is required.";
    // else if (!/^\d+$/.test(headId)) newErrors.headId = "Head ID must be a number.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // setSuccessMessage("Your format is all correct, pleas÷e wait a moment.");
    await addDepartment(name, 0);
  };

  return (
    <ComponentCard title="Add Department" desc="">
      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
       {error && <p className="text-red-400">{error}</p>}
        <div>
          <Label>Department Name</Label>
          <Input
            type="text"
            value={name}
            error={!!errors.name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter department name"
            hint={errors.name || ""}
          />
        </div>

        {/* <div>
          <Label>Head ID</Label>
          <Input
            type="number"
            value={headId}
            error={!!errors.headId}
            onChange={(e) => setHeadId(Number(e.target.value))}
            placeholder="Enter head user ID"
            hint={errors.headId || ""}
          />
        </div> */}

        <button
          type="submit"
          className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          Create Department
        </button>

        {/* {successMessage && (
          <p className="text-green-600 text-sm mt-2">{successMessage}</p>
        )} */}
      </form>
    </ComponentCard>
  );
}
