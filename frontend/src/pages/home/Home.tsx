import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
// import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
// import StatisticsChart from "../../components/ecommerce/StatisticsChart";
// // import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
// import RecentOrders from "../../components/ecommerce/RecentOrders";
import DemographicCard from "../../components/ecommerce/DemographicCard";
import PageMeta from "../../components/common/PageMeta";
import { useAuth } from "../../utils/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDashboardStore } from "../../store/dashboardStore";
import UpcomingEvents from "../../components/ecommerce/UpcomingEvents";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: overviewData, loading, fetchDashboard } = useDashboardStore();

  const safeEvents = overviewData?.upcomingEvents.map((event) => ({
    ...event,
    type: (event.type || "Info") as "Info" | "Success" | "Warning" | "Danger",
  }));
  console.log(overviewData, "overviewDataoverviewDataoverviewDataoverviewData");

  useEffect(() => {
    if (!user) navigate("/signin");
  }, [user, navigate]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (!user || loading || !overviewData) return <p>Loading dashboard...</p>;

  return (
    <>
      <PageMeta
        title="HRMS FOR OCELOTS"
        description="Admin Dashboard For HRMS Ocelots"
      />
      <div className="grid grid-cols-4 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-12">
          <EcommerceMetrics data={overviewData.overview} />

          {/* <MonthlySalesChart /> */}
        </div>

        {/* <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div> */}

        {/* <div className="col-span-12">
          <StatisticsChart />
        </div> */}

        <div className="col-span-12 xl:col-span-5">
          <DemographicCard data={overviewData.demographics || []} />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <UpcomingEvents data={safeEvents || []} />
        </div>
      </div>
    </>
  );
}
