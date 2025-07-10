import Badge from "../ui/badge/Badge";

type Overview = {
  totalEmployees: number;
  totalDepartments: number;
  todayAttendanceCount: number;
  changes?: {
    employeeChange: number;
    departmentChange: number;
    attendanceChange: number;
  };
};

type Props = {
  data: Overview;
};

const getBadgeColor = (
  value: number
): "success" | "error" | "warning" | "info" | undefined =>
  value > 0 ? "success" : value < 0 ? "error" : "warning";



export default function EcommerceMetrics({ data }: Props) {
  return (
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* Total Employees */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          {/* <img src="../../icons/group.svg" alt="employee icon" />
           */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="8"
              r="3.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M4 20C4 16.6863 7.13401 14 11 14H13C16.866 14 20 16.6863 20 20"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Employees
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {data.totalEmployees.toLocaleString()}
            </h4>
          </div>
          <Badge color={getBadgeColor(data.changes?.employeeChange ?? 0)}>
            {/* <img
              src={getArrowIcon(data.changes?.employeeChange ?? 0)}
              alt="trend icon"
            /> */}
            {data.changes?.employeeChange ?? 0 > 0 ? (
              <svg
                className="fill-current"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.68538 1.62391C6.54806 1.47067 6.34864 1.37428 6.12671 1.37428C6.1264 1.37428 6.1261 1.37428 6.12579 1.37428C5.9337 1.37407 5.74155 1.44726 5.59495 1.59377L2.59486 4.5918C2.30186 4.88459 2.30169 5.35946 2.59448 5.65246C2.88727 5.94546 3.36215 5.94562 3.65514 5.65283L5.37671 3.93247V10.125C5.37671 10.5392 5.71249 10.875 6.12671 10.875C6.54092 10.875 6.87671 10.5392 6.87671 10.125V3.93578L8.59484 5.65281C8.88782 5.94561 9.3627 5.94546 9.6555 5.65248C9.9483 5.35949 9.94815 4.88462 9.65516 4.59182L6.68538 1.62391Z"
                  fill="currentColor"
                />
              </svg>
            ) : data.changes?.employeeChange ?? 0 < 0 ? (
              <svg
                className="fill-current"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.31462 10.3761C5.45194 10.5293 5.65136 10.6257 5.87329 10.6257C5.8736 10.6257 5.8739 10.6257 5.87421 10.6257C6.0663 10.6259 6.25845 10.5527 6.40505 10.4062L9.40514 7.4082C9.69814 7.11541 9.69831 6.64054 9.40552 6.34754C9.11273 6.05454 8.63785 6.05438 8.34486 6.34717L6.62329 8.06753V1.875C6.62329 1.46079 6.28751 1.125 5.87329 1.125C5.45908 1.125 5.12329 1.46079 5.12329 1.875V8.06422L3.40516 6.34719C3.11218 6.05439 2.6373 6.05454 2.3445 6.34752C2.0517 6.64051 2.05185 7.11538 2.34484 7.40818L5.31462 10.3761Z"
                  fill="currentColor"
                />
              </svg>
            ) : null}
            {Math.abs(data.changes?.employeeChange ?? 0).toFixed(2)}%
          </Badge>
        </div>
      </div>

      {/* Total Departments */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          {/* <img src="../../icons/box-line.svg" alt="department icon" /> */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 21V5C3 4.44772 3.44772 4 4 4H20C20.5523 4 21 4.44772 21 5V21"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 10H21"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M7 14V18"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M12 14V18"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M17 14V18"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Departments
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {data.totalDepartments.toLocaleString()}
            </h4>
          </div>
          <Badge color={getBadgeColor(data.changes?.departmentChange ?? 0)}>
              {data.changes?.departmentChange ?? 0 > 0 ? (
              <svg
                className="fill-current"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.68538 1.62391C6.54806 1.47067 6.34864 1.37428 6.12671 1.37428C6.1264 1.37428 6.1261 1.37428 6.12579 1.37428C5.9337 1.37407 5.74155 1.44726 5.59495 1.59377L2.59486 4.5918C2.30186 4.88459 2.30169 5.35946 2.59448 5.65246C2.88727 5.94546 3.36215 5.94562 3.65514 5.65283L5.37671 3.93247V10.125C5.37671 10.5392 5.71249 10.875 6.12671 10.875C6.54092 10.875 6.87671 10.5392 6.87671 10.125V3.93578L8.59484 5.65281C8.88782 5.94561 9.3627 5.94546 9.6555 5.65248C9.9483 5.35949 9.94815 4.88462 9.65516 4.59182L6.68538 1.62391Z"
                  fill="currentColor"
                />
              </svg>
            ) : data.changes?.departmentChange ?? 0 < 0 ? (
              <svg
                className="fill-current"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.31462 10.3761C5.45194 10.5293 5.65136 10.6257 5.87329 10.6257C5.8736 10.6257 5.8739 10.6257 5.87421 10.6257C6.0663 10.6259 6.25845 10.5527 6.40505 10.4062L9.40514 7.4082C9.69814 7.11541 9.69831 6.64054 9.40552 6.34754C9.11273 6.05454 8.63785 6.05438 8.34486 6.34717L6.62329 8.06753V1.875C6.62329 1.46079 6.28751 1.125 5.87329 1.125C5.45908 1.125 5.12329 1.46079 5.12329 1.875V8.06422L3.40516 6.34719C3.11218 6.05439 2.6373 6.05454 2.3445 6.34752C2.0517 6.64051 2.05185 7.11538 2.34484 7.40818L5.31462 10.3761Z"
                  fill="currentColor"
                />
              </svg>
            ) : null}
            {Math.abs(data.changes?.departmentChange ?? 0).toFixed(2)}%
          </Badge>
        </div>
      </div>

      {/* Today Attendance */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          {/* <img src="../../icons/group.svg" alt="attendance icon" /> */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="3"
              y="4"
              width="18"
              height="18"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M3 9H21"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M9 14L11 16L15 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Today’s Attendance
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {data.todayAttendanceCount.toLocaleString()}
            </h4>
          </div>
          <Badge color={getBadgeColor(data.changes?.attendanceChange ?? 0)}>
            {data.changes?.employeeChange ?? 0 > 0 ? (
              <svg
                className="fill-current"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.68538 1.62391C6.54806 1.47067 6.34864 1.37428 6.12671 1.37428C6.1264 1.37428 6.1261 1.37428 6.12579 1.37428C5.9337 1.37407 5.74155 1.44726 5.59495 1.59377L2.59486 4.5918C2.30186 4.88459 2.30169 5.35946 2.59448 5.65246C2.88727 5.94546 3.36215 5.94562 3.65514 5.65283L5.37671 3.93247V10.125C5.37671 10.5392 5.71249 10.875 6.12671 10.875C6.54092 10.875 6.87671 10.5392 6.87671 10.125V3.93578L8.59484 5.65281C8.88782 5.94561 9.3627 5.94546 9.6555 5.65248C9.9483 5.35949 9.94815 4.88462 9.65516 4.59182L6.68538 1.62391Z"
                  fill="currentColor"
                />
              </svg>
            ) : data.changes?.employeeChange ?? 0 < 0 ? (
              <svg
                className="fill-current"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.31462 10.3761C5.45194 10.5293 5.65136 10.6257 5.87329 10.6257C5.8736 10.6257 5.8739 10.6257 5.87421 10.6257C6.0663 10.6259 6.25845 10.5527 6.40505 10.4062L9.40514 7.4082C9.69814 7.11541 9.69831 6.64054 9.40552 6.34754C9.11273 6.05454 8.63785 6.05438 8.34486 6.34717L6.62329 8.06753V1.875C6.62329 1.46079 6.28751 1.125 5.87329 1.125C5.45908 1.125 5.12329 1.46079 5.12329 1.875V8.06422L3.40516 6.34719C3.11218 6.05439 2.6373 6.05454 2.3445 6.34752C2.0517 6.64051 2.05185 7.11538 2.34484 7.40818L5.31462 10.3761Z"
                  fill="currentColor"
                />
              </svg>
            ) : null}
            {Math.abs(data.changes?.attendanceChange ?? 0).toFixed(2)}%
          </Badge>
        </div>
      </div>
    </div>
  );
}
