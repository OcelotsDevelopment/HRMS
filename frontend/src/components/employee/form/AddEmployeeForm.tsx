import { useEffect, useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Input from "../../input/InputField.tsx";
import Label from "../../form-elements/Label.tsx";
import Select from "../../form/Select.tsx";
import { useDepartmentStore } from "../../../store/departmentStore.ts";
import { useEmployeeStore } from "../../../store/employeeStore.ts";

interface Department {
  value: number;
  label: string;
}
interface User {
  value: number;
  label: string;
}

export default function AddEmployeeForm() {
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
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [departmentOptions, setDepartmentOptions] = useState<Department[]>([]);
  const [userDepartmentOptions, setUserDepartmentOptions] = useState<User[]>(
    []
  );

  const addEmployee = useEmployeeStore((state) => state.createEmployee);
  const error = useEmployeeStore((state) => state.error);

  const fetchDepartments = useDepartmentStore(
    (state) => state.fetchDepartments
  );

  const fetchUsersDepartment = useDepartmentStore(
    (state) => state.fetchUsersDepartment
  );

  const findUserDepartments = useDepartmentStore(
    (state) => state.findUserDepartments
  );

  const findDepartments = useDepartmentStore((state) => state.findDepartments);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  useEffect(() => {
    if (findDepartments && Array.isArray(findDepartments)) {
      const formatted = findDepartments.map((dep) => ({
        value: dep.id,
        label: dep.name,
      }));
      setDepartmentOptions(formatted);
    }
  }, [findDepartments]);

  useEffect(() => {
  if (userDepartmentOptions.length === 1) {
    const onlyUser = userDepartmentOptions[0];
    setForm((prev) => ({ ...prev, coordinatorId: onlyUser.value }));
  }
}, [userDepartmentOptions]);


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

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Invalid email format.";
    if (!form.mobile.trim()) newErrors.mobile = "Mobile number is required.";
    if (!form.dob.trim()) newErrors.dob = "Date of birth is required.";
    if (!form.departmentId || form.departmentId <= 0)
      newErrors.departmentId = "Department is required.";
    if (!form.coordinatorId || form.coordinatorId <= 0) {
      newErrors.coordinatorId = "User is required.";
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
    await addEmployee({
      ...form,
      age: Number(form.age),
      departmentId: Number(form.departmentId),
    });
  };

  return (
    <ComponentCard title="Add Employee">
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
              onChange={handleChange}
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
              placeholder="e.g. Frontend Developer"
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
              className="dark:bg-dark-900"
              value={form.departmentId}
            />
            {errors.departmentId && (
              <p className="text-sm text-red-500">{errors.departmentId}</p>
            )}
          </div>

          <div>
            <Label>User</Label>
            {/* <Select
              options={userDepartmentOptions}
              placeholder="Select User"
              onChange={(val) =>
                setForm((prev) => ({ ...prev, coordinatorId: Number(val) }))
              }
              className="dark:bg-dark-900"
              value={form?.coordinatorId}
            /> */}

            <Select
              options={userDepartmentOptions}
              placeholder="Select User"
              onChange={(val: number) => {
                console.log("Selected User ID:", val); // ✅ use this to debug
                setForm((prev) => ({ ...prev, coordinatorId: val }));
              }}
              className="dark:bg-dark-900"
              value={form.coordinatorId}
            />

            {errors?.coordinatorId && (
              <p className="text-sm text-red-500">{errors.coordinatorId}</p>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          Create Employee
        </button>
      </form>
    </ComponentCard>
  );
}
