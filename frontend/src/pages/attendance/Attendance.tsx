import { Tabs } from "../../components/ui/tab/Tabs";
import ListAttendanceLog from "../../components/attendance/attendanceLog/ListAttendanceLog";
import ListDailyAttendance from "../../components/attendance/dailyAttendance/ListDailyAttendance";

function Attendance() {
  return (
    <>
      {/* <div className="max-w-5xl p-6 mx-auto bg-white rounded-2xl dark:bg-gray-900"> */}
      <Tabs
        tabs={[
          {
            id: "tab1",
            label: "All Employee Attendence",
            content: <ListAttendanceLog />,
          },
          {
            id: "tab2",
            label: "Daily Attendence",
            content: <ListDailyAttendance />,
          },
          {
            id: "tab3",
            label: "Payroll",
            content: <div>Hello2</div>,
          },
        ]}
      />
      {/* </div> */}
    </>
  );
}

export default Attendance;
