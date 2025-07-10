import { Modal } from "../../../../ui/modal";
import { useModal } from "../../../../../hooks/useModal";
import EmploymentFrom from "./EmploymentFrom";
import { useEffect, useState } from "react";
import { useEmployeeStore } from "../../../../../store/employeeStore";
import { useParams } from "react-router-dom";
import EditEmploymentForm from "./EmploymentEditForm";

function EmploymentInfo() {
  const { id } = useParams();
  const { isOpen, openModal, closeModal } = useModal();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [employmentId, setEmploymentId] = useState(0);

  const openEditModal = (id: number) => {
    setIsEditOpen(true);
    setEmploymentId(id);
  };
  const closeEditModal = () => setIsEditOpen(false);

  const { employments, fetchEmployments, selectedEmployee } =
    useEmployeeStore();

  useEffect(() => {
    if (selectedEmployee) {
      closeEditModal();
      closeModal();
    }
  }, [selectedEmployee, closeModal]);
  useEffect(() => {
    fetchEmployments(Number(id));
  }, [fetchEmployments, id, selectedEmployee]);

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
          Employment Information
        </h4>

        <button
          onClick={openModal}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 5V19M5 12H19"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Add Employment
        </button>
      </div>
      {employments.length > 0 ? (
        employments.map((employment) => (
          <div className="mt-7 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              {/* <h6 className="text-md font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                  {employment.employerName}
                </h6> */}
              <div className="flex items-center gap-4 my-6">
                <div className="h-px flex-1 bg-neutral-300 dark:bg-neutral-700" />
                <span className="text-lg text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                  {employment.employerName}
                </span>
                <div className="h-px flex-1 bg-neutral-300 dark:bg-neutral-700" />
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-7 2xl:gap-x-32">
                {/* <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Employer Name
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  Musharof
                </p>
              </div> */}

                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Position
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {employment.positionHeld}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Location
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {employment.location}{" "}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Worked From
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {new Date(employment.workedFrom).toLocaleDateString(
                      "en-IN",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Worked Till
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {new Date(employment?.workedTill).toLocaleDateString(
                      "en-IN",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Last Salary Drawn
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {employment?.lastSalaryDrawn}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Reason For Leaving
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {employment.reasonForLeaving}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Remarks
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {employment.remarks}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => openEditModal(Number(employment.id))}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-2 mt-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
            >
              <svg
                className="fill-current"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                  fill=""
                />
              </svg>
              Edit
            </button>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500">No employment records found.</p>
      )}

      {/* Add Form */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <EmploymentFrom />
        </div>
      </Modal>

      {/* Edit Form */}
      <Modal
        isOpen={isEditOpen}
        onClose={closeEditModal}
        className="max-w-[700px] m-4"
      >
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <EditEmploymentForm
            employmentId={employmentId}
            onSuccess={closeEditModal}
          />
        </div>
      </Modal>
    </div>
  );
}

export default EmploymentInfo;
