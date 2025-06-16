import { useEffect, useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Input from "../../input/InputField.tsx";
import Label from "../../form-elements/Label.tsx";
import { useUserStore } from "../../../store/userStore.ts";
import Select from "../../form/Select.tsx";
import { useDepartmentStore } from "../../../store/departmentStore.ts";

interface Department {
  value: number;
  label: string;
}

export default function AddUserForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [departmentId, setDepartmentId] = useState<number>(0);
  const [departmentOptions, setDepartmentOptions] = useState<Department[]>([]);

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    departmentId?: string;
  }>({});

    const addUser = useUserStore((state) => state.addUser);
  const error = useUserStore((state) => state.error);

  const fetchDepartments = useDepartmentStore(
    (state) => state.fetchDepartments
  );
  const findDepartments = useDepartmentStore((state) => state.findDepartments);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  useEffect(() => {
    if (findDepartments && Array.isArray(findDepartments)) {
      const formatted: Department[] = findDepartments.map((department) => ({
        value: department.id,
        label: department.name,
      }));
      setDepartmentOptions(formatted);
    }
  }, [findDepartments]);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = "Name is required.";
    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Invalid email format.";
    if (!departmentId || departmentId <= 0)
      newErrors.departmentId = "Department ID must be a positive number.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await addUser(name, email, departmentId);
  };

  return (
    <ComponentCard title="Add User" desc="">
      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        {error && <p className="text-red-400">{error}</p>}

        <div>
          <Label>User Name</Label>
          <Input
            type="text"
            value={name}
            error={!!errors.name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter user name"
            hint={errors.name || ""}
          />
        </div>

        <div>
          <Label>Email</Label>
          <Input
            type="email"
            value={email}
            error={!!errors.email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            hint={errors.email || ""}
          />
        </div>

        <div>
          <Label>Department</Label>
          {/* <Input
            type="number"
            value={departmentId}
            error={!!errors.departmentId}
            onChange={(e) => setDepartmentId(Number(e.target.value))}
            placeholder="Enter department ID"
            hint={errors.departmentId || ""}
          /> */}

          <Select
            options={departmentOptions}
            placeholder="Select an option"
            onChange={(e) => setDepartmentId(Number(e))}
            className="dark:bg-dark-900"
            value={departmentId}
          />
        </div>

        <button
          type="submit"
          className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          Create User
        </button>
      </form>
    </ComponentCard>
  );
}
