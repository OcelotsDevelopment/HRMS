import { Tabs } from "../../../ui/tab/Tabs";
import EmploymentInfo from "./Employment/EmploymentInfo";
import PayrollInfo from "./Payroll/PayrollInfo";
import QualificationInfo from "./Qualification/QualificationInfo";

export default function UserInfoCard() {
  return (
    <>
      {/* <div className="max-w-5xl p-6 mx-auto bg-white rounded-2xl dark:bg-gray-900"> */}
      <Tabs
        tabs={[
          {
            id: "tab1",
            label: "Employment",
            content: <EmploymentInfo />,
          },
          {
            id: "tab2",
            label: "Qualifications",
            content: <QualificationInfo />,
          },
          {
            id: "tab3",
            label: "Payroll",
            content: <PayrollInfo/>,
          },
        ]}
      />
      {/* </div> */}
    </>
  );
}
