import { useEffect, useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import UserAddressCard from "../../../components/employee/EmployeeProfile/EmployeeAddressCard";
import UserInfoCard from "../../../components/employee/EmployeeProfile/EmployeeInfo/EmployeeInfoCard";
import { useParams } from "react-router-dom";
import { useUserStore } from "../../../store/userStore";
import UserMetaCard from "./userProfile/UserMetaCard";

export default function UserProfile() {
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
    profileImageUrl: "",
    bloodGroup: "",
    nationality: "",
    maritalStatus: "",
    departmentId: 0,
    coordinatorId: 0,
    department: "",
    coordinator: "",
    dateOfJoining: "",
  });

  const { selectedUser, getUserById, users } = useUserStore();

  useEffect(() => {
  getUserById(Number(id));
}, [getUserById, id, users]);

useEffect(() => {
  if (selectedUser) {
    setForm({
      name: selectedUser.name || "",
      email: selectedUser.email || "",
      mobile: "", // User doesn't have mobile in your User type; leave blank or remove
      designation: "", // You can leave blank if not in User schema
      sex: "", // Optional: if in User schema
      dob: "", // Optional: if in User schema
      age: "", // Optional: if in User schema
      placeOfBirth: "", // Optional
      profileImageUrl: selectedUser?.name || "",
      bloodGroup: "", // Optional
      nationality: "", // Optional
      maritalStatus: "", // Optional
      departmentId: selectedUser.departmentId || 0,
      coordinatorId: 0, // If you track this
      department: selectedUser?.headOf?.name || "", // Or however department is attached
      coordinator: "",
      dateOfJoining: "", // Optional
    });
  }
}, [selectedUser, id]);


  return (
    <>
      <PageMeta
        title="HRMS | User Profile"
        description="This is User Profile for Ocelots"
      />
      <PageBreadcrumb pageTitle="Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          User Profile
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
            dateOfJoining={form?.dateOfJoining}
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
