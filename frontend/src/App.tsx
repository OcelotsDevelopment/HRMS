import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import LayoutContent from "./layout/LayoutContent";
import Home from "./pages/home/Home";
import SignInForm from "./pages/Auth/login/SignInForm";
import ListDepartment from "./pages/department/ListDepartment";
import ListUser from "./pages/user/ListUsers";

function App() {
  return (
    <Router>
      <div className="h-full w-full">
        <Routes>
          <Route element={<LayoutContent />}>
            <Route path="/" element={<Home />} />
            <Route path="/depart-managment" element={<ListDepartment />} />
            <Route path="/user-management" element={<ListUser />} />
            {/* Add more routes as needed */}
          </Route>

          <Route path="/signin" element={<SignInForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
