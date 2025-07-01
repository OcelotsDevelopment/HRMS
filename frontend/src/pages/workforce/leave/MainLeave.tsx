import { Tabs } from "../../../components/ui/tab/Tabs";
import ListCompOff from "./ListCompOff";
import ListLeave from "./ListLeave";
import ListPendingLeave from "./ListPending";

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
            content: <ListPendingLeave />,
          },
          {
            id: "tab3",
            label: "Compensatory Off",
            content: <ListCompOff/>,
          },
        ]}
      />
      {/* </div> */}
    </>
  );
}

export default MainLeave;
