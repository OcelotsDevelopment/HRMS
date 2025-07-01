import { useEffect, useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import UserAddressCard from "../../../components/employee/EmployeeProfile/EmployeeAddressCard";
import UserInfoCard from "../../../components/employee/EmployeeProfile/EmployeeInfo/EmployeeInfoCard";
import UserMetaCard from "../../../components/employee/EmployeeProfile/EmployeeMetaCard";
import { useEmployeeStore } from "../../../store/employeeStore";
import { useParams } from "react-router-dom";

export default function EmployeeProfiles() {
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    designation: "",
    sex: "",
    dob: "",
    age: "",
    placeOfBirth: "",
    profileImageUrl:"",
    bloodGroup: "",
    nationality: "",
    maritalStatus: "",
    departmentId: 0,
    coordinatorId: 0,
    department: "",
    coordinator: "",
  });

  const { selectedEmployee, getEmployeeById, employees } = useEmployeeStore();

  useEffect(() => {
    getEmployeeById(Number(id));
  }, [getEmployeeById, id, employees]);

  useEffect(() => {
    
    if (selectedEmployee) {
      setForm({
        name: selectedEmployee.name || "",
        email: selectedEmployee.email || "",
        mobile: selectedEmployee.mobile || "",
        designation: selectedEmployee.designation || "",
        sex: selectedEmployee.sex || "",
        dob: selectedEmployee.dob ? selectedEmployee.dob.split("T")[0] : "",
        age: selectedEmployee.age?.toString() || "",
        placeOfBirth: selectedEmployee.placeOfBirth || "",
        profileImageUrl:selectedEmployee?.profileImageUrl || "",
        bloodGroup: selectedEmployee.bloodGroup || "",
        nationality: selectedEmployee.nationality || "",
        maritalStatus: selectedEmployee.maritalStatus || "",
        departmentId: selectedEmployee.departmentId || 0,
        coordinatorId: selectedEmployee.coordinatorId || 0,
        department: selectedEmployee?.department?.name,
        coordinator: selectedEmployee?.coordinator?.name || "",
      });
    }
  }, [selectedEmployee, id]);

  return (
    <>
      <PageMeta
        title="HRMS | Employee Profile"
        description="This is Employee Profile for Ocelots"
      />
      <PageBreadcrumb pageTitle="Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Employee Profile
        </h3>
        <div className="space-y-6">
          <UserMetaCard
            id={Number(id)}
            name={form.name}
            designation={form?.designation}
            sex={form?.sex}
            placeOfBirth={form?.placeOfBirth}
            profileImageUrl={form?.profileImageUrl}
            department={form?.department}
            coordinator={form?.coordinator}
            departmentId={form?.departmentId}
            coordinatorId={form?.coordinatorId}
            handleChange={(name, value) =>
              setForm((prev) => ({ ...prev, [name]: value }))
            }
          />
          <UserAddressCard />
          <UserInfoCard />
          
        </div>
      </div>
    </>
  );
}
