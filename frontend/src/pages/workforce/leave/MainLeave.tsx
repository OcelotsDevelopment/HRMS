import { Tabs } from "../../../components/ui/tab/Tabs";
import ListLeave from "./ListLeave";

function MainLeave() {
  return (
    <>
      {/* <div className="max-w-5xl p-6 mx-auto bg-white rounded-2xl dark:bg-gray-900"> */}
      <Tabs
        tabs={[
          {
            id: "tab1",
            label: "All Employee leave",
            content: <ListLeave />,
          },
          {
            id: "tab2",
            label: "All Pending Leaves",
            content: <div>tab 2</div>,
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

export default MainLeave;
