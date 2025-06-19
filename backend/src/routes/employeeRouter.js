// routes/employee.routes.js
import express from "express";
import {
  addEmployment,
  createEmployee,
  deleteEmployment,
  getAllEmployees,
  getEmployeeById,
  getEmploymentById,
  listEmployment,
  updateEmployee,
  updateEmployment,
  addQualification,
  listQualification,
  getQualificationById,
  updateQualification,

  // Payroll
   createPayroll,
  getPayrollById,
  getPayrollsByEmployee,
  updatePayroll,
  deletePayroll,
} from "../controller/employeeController.js";


const router = express.Router();

router.post("/", createEmployee);
router.get("/", getAllEmployees);
router.get("/:id", getEmployeeById);
router.put("/:id", updateEmployee);

// Employment routes
router.post("/employment", addEmployment); // Add
router.get("/employments/:id", listEmployment); // List by employee ID
router.get("/employment/:id", getEmploymentById); // Get one
router.put("/employment/:employmentId", updateEmployment); // Update
router.delete("/employment/:employmentId", deleteEmployment); // Delete

// Qualification routes
// Qualification routes
router.post("/qualification", addQualification); // Add qualification
router.get("/qualifications/:id", listQualification); // List by employee ID
router.get("/qualification/:id", getQualificationById); // Get one
router.put("/qualification/:qualificationId", updateQualification); // Update


//Payroll
router.post("/payroll", createPayroll);
router.get("/payroll/:id", getPayrollById);
router.get("/payrolls/:employeeId", getPayrollsByEmployee);
router.put("/payroll/:id", updatePayroll);
router.delete("/payroll/:id", deletePayroll);

export default router;
