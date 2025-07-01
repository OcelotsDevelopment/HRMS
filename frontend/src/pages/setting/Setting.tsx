import { Tabs } from "../../components/ui/tab/Tabs";
import ListRegion from "../../components/region/Region";
import ListHolidayType from "../../components/holidayType/ListHolidayType";

function Setting() {
  return (
    <>
      {/* <div className="max-w-5xl p-6 mx-auto bg-white rounded-2xl dark:bg-gray-900"> */}
      <Tabs
        tabs={[
          {
            id: "tab1",
            label: "Region",
            content: <ListRegion />,
          },
          {
            id: "tab2",
            label: "Holiday Type",
            content: <ListHolidayType />,
          },
        ]}
      />
      {/* </div> */}
    </>
  );
}

export default Setting;
