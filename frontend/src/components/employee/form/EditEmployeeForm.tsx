import { useEffect, useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Input from "../../input/InputField.tsx";
import Label from "../../form-elements/Label.tsx";
import Select from "../../form/Select.tsx";
import { useDepartmentStore } from "../../../store/departmentStore.ts";
import { useEmployeeStore } from "../../../store/employeeStore.ts";

interface Props {
  employee: {
    id: number;
  };
}

interface Department {
  value: number;
  label: string;
}

interface User {
  value: number;
  label: string;
}
export default function EditEmployeeForm({ employee }: Props) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    designation: "",
    sex: "",
    dob: "",
    age: "",
    placeOfBirth: "",
    bloodGroup: "",
    nationality: "",
    maritalStatus: "",
    departmentId: 0,
    coordinatorId: 0,
    dateOfJoining: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [departmentOptions, setDepartmentOptions] = useState<Department[]>([]);
  const [userDepartmentOptions, setUserDepartmentOptions] = useState<User[]>(
    []
  );

  const { selectedEmployee, getEmployeeById, updateEmployee, error } =
    useEmployeeStore();

  const fetchDepartments = useDepartmentStore(
    (state) => state.fetchDepartments
  );

  const fetchUsersDepartment = useDepartmentStore(
    (state) => state.fetchUsersDepartment
  );
  const findDepartments = useDepartmentStore((state) => state.findDepartments);

  const findUserDepartments = useDepartmentStore(
    (state) => state.findUserDepartments
  );

  useEffect(() => {
    if (findUserDepartments && Array.isArray(findUserDepartments)) {
      const formatted = [
        { value: 0, label: "Select a user" },
        ...findUserDepartments.map((user) => ({
          value: user.id,
          label: user.name,
        })),
      ];

      setUserDepartmentOptions(formatted);
    }
  }, [findUserDepartments]);

  useEffect(() => {
    fetchDepartments();
    getEmployeeById(employee.id);
  }, [employee.id, fetchDepartments, getEmployeeById]);

  useEffect(() => {
    if (findDepartments) {
      const formatted = findDepartments.map((dep) => ({
        value: dep.id,
        label: dep.name,
      }));
      setDepartmentOptions(formatted);
    }
  }, [findDepartments]);

  useEffect(() => {
    if (selectedEmployee && selectedEmployee.id === employee.id) {
      setForm({
        name: selectedEmployee.name || "",
        email: selectedEmployee.email || "",
        mobile: selectedEmployee.mobile || "",
        designation: selectedEmployee.designation || "",
        sex: selectedEmployee.sex || "",
        dob: selectedEmployee.dob ? selectedEmployee.dob.split("T")[0] : "",
        age: selectedEmployee.age?.toString() || "",
        placeOfBirth: selectedEmployee.placeOfBirth || "",
        bloodGroup: selectedEmployee.bloodGroup || "",
        nationality: selectedEmployee.nationality || "",
        maritalStatus: selectedEmployee.maritalStatus || "",
        departmentId: selectedEmployee.departmentId || 0,
        coordinatorId: selectedEmployee.coordinatorId || 0,
        dateOfJoining: selectedEmployee.dateOfJoining
          ? selectedEmployee.dateOfJoining.split("T")[0]
          : "",
      });
    }
  }, [selectedEmployee, employee.id]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Invalid email format.";
    if (!form.mobile.trim()) newErrors.mobile = "Mobile is required.";
    if (!form.dob) newErrors.dob = "Date of birth is required.";
    if (!form.departmentId || form.departmentId <= 0)
      newErrors.departmentId = "Department is required.";
    if (!form.coordinatorId || form.coordinatorId <= 0) {
      newErrors.coordinatorId = "User is required.";
      if (!form.dateOfJoining)
        newErrors.dateOfJoining = "Date of joining is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await updateEmployee(employee.id, {
      ...form,
      age: Number(form.age),
      departmentId: Number(form.departmentId),
      dateOfJoining: new Date(form.dateOfJoining).toISOString(), // ✅ Ensure ISO string format if backend expects it
    });
  };

  return (
    <ComponentCard title="Edit Employee">
      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        {error && <p className="text-red-400">{error}</p>}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <Label>Name</Label>
            <Input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              error={!!errors.name}
              hint={errors.name}
              placeholder="Full name"
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              name="email"
              type="email"
              value={form.email}
              // onChange={handleChange}
              error={!!errors.email}
              hint={errors.email}
              placeholder="Email address"
            />
          </div>

          <div>
            <Label>Mobile</Label>
            <Input
              name="mobile"
              type="text"
              value={form.mobile}
              onChange={handleChange}
              error={!!errors.mobile}
              hint={errors.mobile}
              placeholder="Mobile number"
            />
          </div>

          <div>
            <Label>Designation</Label>
            <Input
              name="designation"
              type="text"
              value={form.designation}
              onChange={handleChange}
              placeholder="Designation"
            />
          </div>

          <div>
            <Label>Sex</Label>
            <Input
              name="sex"
              type="text"
              value={form.sex}
              onChange={handleChange}
              placeholder="Male / Female / Other"
            />
          </div>

          <div>
            <Label>Date of Birth</Label>
            <Input
              name="dob"
              type="date"
              value={form.dob}
              onChange={handleChange}
              error={!!errors.dob}
              hint={errors.dob}
            />
          </div>
          <div>
            <Label>Date of Joining</Label>
            <Input
              name="dateOfJoining"
              type="date"
              value={form.dateOfJoining}
              onChange={handleChange}
              placeholder="YYYY-MM-DD"
              error={!!errors.dateOfJoining}
              hint={errors.dateOfJoining}
            />
          </div>

          <div>
            <Label>Age</Label>
            <Input
              name="age"
              type="number"
              value={form.age}
              onChange={handleChange}
              placeholder="Age"
            />
          </div>

          <div>
            <Label>Place of Birth</Label>
            <Input
              name="placeOfBirth"
              type="text"
              value={form.placeOfBirth}
              onChange={handleChange}
              placeholder="City/State"
            />
          </div>

          <div>
            <Label>Blood Group</Label>
            <Input
              name="bloodGroup"
              type="text"
              value={form.bloodGroup}
              onChange={handleChange}
              placeholder="A+, B-, O+..."
            />
          </div>

          <div>
            <Label>Nationality</Label>
            <Input
              name="nationality"
              type="text"
              value={form.nationality}
              onChange={handleChange}
              placeholder="Indian / Other"
            />
          </div>

          <div>
            <Label>Marital Status</Label>
            <Input
              name="maritalStatus"
              type="text"
              value={form.maritalStatus}
              onChange={handleChange}
              placeholder="Unmarried / Married"
            />
          </div>

          <div>
            <Label>Department</Label>
            <Select
              options={departmentOptions}
              placeholder="Select department"
              onChange={async (val) => {
                setForm((prev) => ({ ...prev, departmentId: Number(val) }));
                await fetchUsersDepartment(Number(val));
              }}
              value={form.departmentId}
              className="dark:bg-dark-900"
            />
            {errors.departmentId && (
              <p className="text-sm text-red-500">{errors.departmentId}</p>
            )}
          </div>

          <div>
            <Label>Coordinator</Label>
            <Select
              options={userDepartmentOptions}
              placeholder="Select User"
              onChange={(val) =>
                setForm((prev) => ({ ...prev, coordinatorId: val }))
              }
              value={form.coordinatorId}
              className="dark:bg-dark-900"
            />
            {errors.coordinatorId && (
              <p className="text-sm text-red-500">{errors.coordinatorId}</p>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          Update Employee
        </button>
      </form>
    </ComponentCard>
  );
}
