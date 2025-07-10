import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import LayoutContent from "./layout/LayoutContent";
import Home from "./pages/home/Home";
import SignInForm from "./pages/Auth/login/SignInForm";
import ListDepartment from "./pages/department/ListDepartment";
import ListUser from "./pages/user";
import NotFound from "./pages/404/NotFound";
import ListEmployee from "./pages/employee/ListEmployee";
import EmployeeProfiles from "./pages/employee/EmployeeDetails/EmployeeProfile";
import Calendar from "./pages/Calendar";
import Setting from "./pages/setting/Setting";
import ListHoliday from "./pages/workforce/holiday/ListHoliday";
import Attendance from "./pages/attendance/Attendance";
import ViewPayrollPage from "./pages/payroll/ViewPayrollPage";
import MainLeave from "./pages/workforce/leave/MainLeave";
import UserProfile from "./pages/user/userDetails/UserProfile";

function App() {
  return (
    <Router>
      <div className="h-full w-full">
        <Routes>
          <Route element={<LayoutContent />}>
            <Route path="/" element={<Home />} />
            <Route path="/depart-managment" element={<ListDepartment />} />
            <Route path="/user-management" element={<ListUser />} />
            <Route
              path="/employee-management/add-details/:id"
              element={<EmployeeProfiles />}
            />

            {/* employee managment */}
            <Route path="/employee-management" element={<ListEmployee />} />
            <Route
              path="/user-management/add-details/:id"
              element={<UserProfile />}
            />

            {/* workforce */}
            <Route path="/workforce/holiday" element={<ListHoliday />} />

            <Route path="/workforce/leave" element={<MainLeave />} />

            <Route path="/workforce/events" element={<Calendar />} />

            {/* Attendance */}
            <Route path="/attendance" element={<Attendance />} />

            {/* Payroll */}
            <Route path="/payroll" element={<ViewPayrollPage />} />

            {/* SETTINGS */}
            <Route path="/settings" element={<Setting />} />

            {/* sample */}
            {/* <Route path="/sample" element={<DefaultInputs/>}/> */}
          </Route>

          <Route path="/signin" element={<SignInForm />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
