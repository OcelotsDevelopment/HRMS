import { Tabs } from "../EmployeeDetailsTabs";
import EmploymentInfo from "./Employment/EmploymentInfo";

const TabContent = ({ text }: { text: string }) => (
  <div className="p-4 text-sm text-gray-600 dark:text-neutral-300">{text}</div>
);

export default function UserInfoCard() {
  
  return (
    <>
      {/* <div className="max-w-5xl p-6 mx-auto bg-white rounded-2xl dark:bg-gray-900"> */}
      <Tabs
        tabs={[
          {
            id: "tab1",
            label: "Employment",
            content: (
             <EmploymentInfo/>
            ),
          },
          {
            id: "tab2",
            label: "Attendance",
            content: <TabContent text="Attendance data goes here." />,
          },
          {
            id: "tab3",
            label: "Documents",
            content: <TabContent text="Uploaded documents and files." />,
          },
        ]}
      />
      {/* </div> */}
    </>
  );
}
