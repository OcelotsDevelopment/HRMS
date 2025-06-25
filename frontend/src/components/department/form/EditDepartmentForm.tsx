import { useState, useEffect } from "react";
import ComponentCard from "../../common/ComponentCard";
import Input from "../../input/InputField.tsx";
import Label from "../../form-elements/Label.tsx";
import { useDepartmentStore } from "../../../store/departmentStore.ts";
import Loader from "../../common/Loader.tsx";

interface EditDepartmentFormProps {
  department: {
    id: number;
  };
}

export default function EditDepartmentForm({
  department,
}: EditDepartmentFormProps) {
  const [name, setName] = useState("");
  const [headId, setHeadId] = useState(0);
  const [errors, setErrors] = useState<{ name?: string; headId?: string }>({});

  const updateDepartment = useDepartmentStore(
    (state) => state.updateDepartment
  );
  const error = useDepartmentStore((state) => state.error);

  const getDepartmentById = useDepartmentStore(
    (state) => state.getDepartmentById
  );
  const selectedDepartment = useDepartmentStore(
    (state) => state.selectedDepartment
  );
  const loading = useDepartmentStore((state) => state.loading);

  useEffect(() => {
    async function fetchData() {
      if (department?.id) {
        await getDepartmentById(department.id);
      }
    }

    fetchData();
  }, [department?.id, getDepartmentById]);

  useEffect(() => {
    if (selectedDepartment) {
      setName(selectedDepartment?.name);
      setHeadId(selectedDepartment?.headId)
    }
  }, [selectedDepartment]);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = "Department name is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await updateDepartment(department.id, name,headId);
  };

  return (
    <ComponentCard title="Edit Department" desc="">
      {loading && <Loader />}
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
          Update Department
        </button>
      </form>
    </ComponentCard>
  );
}
