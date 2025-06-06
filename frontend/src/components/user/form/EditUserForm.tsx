import { useState, useEffect } from "react";
import ComponentCard from "../../common/ComponentCard";
import Input from "../../input/InputField.tsx";
import Label from "../../form-elements/Label.tsx";
import { useUserStore } from "../../../store/userStore.ts";
import Loader from "../../common/Loader.tsx";

interface EditUserFormProps {
  user: {
    id: number;
  };
}

export default function EditUserForm({ user }: EditUserFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [departmentId, setDepartmentId] = useState<number>(0);
  const [errors, setErrors] = useState<{ name?: string; email?: string; departmentId?: string }>({});

  const updateUser = useUserStore((state) => state.updateUser);
  const getUserById = useUserStore((state) => state.getUserById);
  const selectedUser = useUserStore((state) => state.selectedUser);
  const error = useUserStore((state) => state.error);
  const loading = useUserStore((state) => state.loading);

  useEffect(() => {
    if (user?.id) {
      getUserById(user.id);
    }
  }, [user?.id, getUserById]);

  useEffect(() => {
    if (selectedUser) {
      setName(selectedUser.name);
      setEmail(selectedUser.email);
      setDepartmentId(selectedUser.departmentId);
    }
  }, [selectedUser]);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = "Name is required.";
    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Invalid email format.";
    if (!departmentId || departmentId <= 0) newErrors.departmentId = "Department ID must be a positive number.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await updateUser(user.id, { name, email, departmentId });
  };

  return (
    <ComponentCard title="Edit User" desc="">
      {loading && <Loader />}
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
          <Label>Department ID</Label>
          <Input
            type="number"
            value={departmentId}
            error={!!errors.departmentId}
            onChange={(e) => setDepartmentId(Number(e.target.value))}
            placeholder="Enter department ID"
            hint={errors.departmentId || ""}
          />
        </div>

        <button
          type="submit"
          className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          Update User
        </button>
      </form>
    </ComponentCard>
  );
}
