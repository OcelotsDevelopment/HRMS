import { useModal } from "../../../../hooks/useModal";
import { Modal } from "../../../../components/ui/modal";
import Input from "../../../../components/form/input/InputField";
import Label from "../../../../components/form/Label";

import { useDepartmentStore } from "../../../../store/departmentStore";
import { useCallback, useEffect, useRef, useState } from "react";
import { useUserStore } from "../../../../store/userStore";
import type { Area } from "react-easy-crop";
import Cropper from "react-easy-crop";
import { useUploadStore } from "../../../../store/uploadStore";
import Select from "../../../../components/form/Select";
import Button from "../../../../components/ui/button/Button";
import getCroppedImg from "../../../../utils/cropImageHelper";

interface UserMetaCardProps {
  id: number;
  name: string;
  designation: string;
  sex: string;
  placeOfBirth: string;
  profileImageUrl: string;
  department: string;
  coordinator: string;
  departmentId: number;
  coordinatorId: number;
  dateOfJoining: string;
  handleChange: (name: string, value: string) => void;
}

interface User {
  value: number;
  label: string;
}

interface Department {
  value: number;
  label: string;
}

export default function UserMetaCard({
  id,
  name,
  designation,
  sex,
  placeOfBirth,
  profileImageUrl,
  department,
  coordinator,
  departmentId,
  coordinatorId,
  dateOfJoining,
  handleChange,
}: UserMetaCardProps) {
  const [departmentOptions, setDepartmentOptions] = useState<Department[]>([]);
  const [userDepartmentOptions, setUserDepartmentOptions] = useState<User[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { isOpen, openModal, closeModal } = useModal();

  const fetchUsersDepartment = useDepartmentStore((state) => state.fetchUsersDepartment);
  const fetchDepartments = useDepartmentStore((state) => state.fetchDepartments);
  const findUserDepartments = useDepartmentStore((state) => state.findUserDepartments);
  const findDepartments = useDepartmentStore((state) => state.findDepartments);

  const { updateUser } = useUserStore();
  const uploadImage = useUploadStore((state) => state.uploadImage);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

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

  // image upload & crop
  const inputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);

  const triggerInput = () => {
    inputRef.current?.click();
  };

  const onSelectFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl);
      setIsCropModalOpen(true);
    }
  };

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleCropSave = async () => {
    try {
      if (!croppedAreaPixels || !imageSrc) return;
      const blobUrl = await getCroppedImg(imageSrc, croppedAreaPixels);
      const blob = await fetch(blobUrl).then((res) => res.blob());
      const file = new File([blob], "profile.jpg", { type: "image/jpeg" });

      await uploadImage(id, file);
      setCroppedImage(blobUrl);
      setIsCropModalOpen(false);
    } catch (e) {
      console.error("Error cropping/uploading image:", e);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name is required.";
    if (!designation.trim()) newErrors.designation = "Designation is required.";
    if (!placeOfBirth.trim()) newErrors.placeOfBirth = "Place Of Birth is required.";
    if (!departmentId || departmentId <= 0) newErrors.departmentId = "Department is required.";
    if (!coordinatorId || coordinatorId <= 0) newErrors.coordinatorId = "User is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    // await updateUser(Number(id), {
    //   name,
    //   role,
    //   placeOfBirth,
    //   departmentId: Number(departmentId),
    //   coordinatorId: Number(coordinatorId),
    // });

    closeModal();
  };

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="flex flex-col items-center space-y-4">
              <div
                onClick={triggerInput}
                className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800 cursor-pointer"
              >
                <img
                  src={
                    profileImageUrl
                      ? profileImageUrl
                      : croppedImage
                      ? croppedImage
                      : sex === "male"
                      ? "../../../../public/maleEmployee.png"
                      : sex === "female"
                      ? "../../../../public/femaleEmployee.png"
                      : "../../../../public/ms-icon-310x310.png"
                  }
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
              </div>
              <input ref={inputRef} type="file" accept="image/*" onChange={onSelectFile} className="hidden" />
            </div>

            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {name}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">{designation}</p>
                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{placeOfBirth}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-7 2xl:gap-x-7">
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Department</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">{department}</p>
              </div>
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Coordinator</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">{coordinator}</p>
              </div>
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Date Of Joining</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {new Date(dateOfJoining).toDateString()}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            Edit
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">Edit Personal Information</h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">Update your details to keep your profile up-to-date.</p>
          <form className="flex flex-col" onSubmit={handleSave}>
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div>
                <Label>Name</Label>
                <Input type="text" value={name} name="name" error={!!errors.name} hint={errors.name} onChange={(e) => handleChange(e.target.name, e.target.value)} />
              </div>
              <div>
                <Label>Designation</Label>
                <Input type="text" value={designation} name="designation" error={!!errors.designation} hint={errors.designation} onChange={(e) => handleChange(e.target.name, e.target.value)} />
              </div>
              <div>
                <Label>Place of Birth</Label>
                <Input type="text" value={placeOfBirth} name="placeOfBirth" error={!!errors.placeOfBirth} hint={errors.placeOfBirth} onChange={(e) => handleChange(e.target.name, e.target.value)} />
              </div>
              <div>
                <Label>Department</Label>
                <Select options={departmentOptions} placeholder="Select department" onChange={async (val) => {
                  handleChange("departmentId", String(val));
                  handleChange("coordinatorId", "0");
                  await fetchUsersDepartment(Number(val));
                }} value={departmentId} className="dark:bg-dark-900" />
                {errors.departmentId && <p className="text-sm text-red-500">{errors.departmentId}</p>}
              </div>
              <div>
                <Label>User</Label>
                <Select options={userDepartmentOptions} placeholder="Select User" onChange={(val) => handleChange("coordinatorId", String(val))} value={coordinatorId} className="dark:bg-dark-900" />
                {errors.coordinatorId && <p className="text-sm text-red-500">{errors.coordinatorId}</p>}
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6 justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>Close</Button>
              <Button size="sm" type="submit">Save Changes</Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Cropper Modal */}
      <Modal isOpen={isCropModalOpen} onClose={() => setIsCropModalOpen(false)} className="max-w-2xl p-6">
        <div className="relative h-[400px] bg-gray-100">
          <Cropper image={imageSrc!} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} />
        </div>
        <div className="mt-4 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsCropModalOpen(false)}>Cancel</Button>
          <Button onClick={handleCropSave}>Crop & Save</Button>
        </div>
      </Modal>
    </>
  );
}

function readFile(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result as string), false);
    reader.readAsDataURL(file);
  });
}
