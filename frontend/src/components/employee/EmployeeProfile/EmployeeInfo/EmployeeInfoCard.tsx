import { Tabs } from "../../../ui/tab/Tabs";
import BankDetailInfo from "./bankDetails/BankDetailInfo";
import EmployeeEarningsList from "./earnAndDeduc/EmployeeEarningsList";
import EmploymentInfo from "./Employment/EmploymentInfo";
import LeaveInfo from "./leaveEmployee/LeaveInfo";
import PayrollInfo from "./Payroll/PayrollInfo";
import QualificationInfo from "./Qualification/QualificationInfo";

export default function UserInfoCard() {
  return (
    <>
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
            label: "Bank Detail",
            content: <BankDetailInfo />,
          },
          {
            id: "tab4",
            label: "Payroll",
            content: <PayrollInfo />,
          },
          {
            id: "tab5",
            label: "Leave",
            content: <LeaveInfo />,
          },
          {
            id: "tab6",
            label: "Earnings & Deductions",
            content: <EmployeeEarningsList />,
          },
        ]}
      />
    </>
  );
}
