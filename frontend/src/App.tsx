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
import ListLeave from "./pages/workforce/leave/ListLeave";
// import AddEmployeeForm from "./components/employee/form/AddEmployeeForm";

function App() {
  return (
    <Router>
      <div className="h-full w-full">
        <Routes>
          <Route element={<LayoutContent />}>
            <Route path="/" element={<Home />} />
            <Route path="/depart-managment" element={<ListDepartment />} />
            <Route path="/user-management" element={<ListUser />} />

            {/* employee managment */}
            <Route path="/employee-management" element={<ListEmployee />} />
            <Route
              path="/employee-management/add-details/:id"
              element={<EmployeeProfiles />}
            />

            {/* workforce */}
            <Route path="/workforce/holiday" element={<ListHoliday />} />

            <Route path="/workforce/leave" element={<ListLeave />} />

            <Route path="/workforce/events" element={<Calendar />} />

            {/* SETTINGS */}
            <Route path="/settings" element={<Setting />} />
          </Route>

          <Route path="/signin" element={<SignInForm />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
