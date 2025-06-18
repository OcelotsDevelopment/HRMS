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
  updateEmployment
} from "../controller/employeeController.js";

const router = express.Router();

router.post("/", createEmployee);
router.get("/", getAllEmployees);
router.get("/:id", getEmployeeById);
router.put("/:id", updateEmployee);

// Employment routes
router.post("/employment", addEmployment); // Add
router.get("/employments/:id", listEmployment); // List by employee ID
router.get("/employment/:employmentId", getEmploymentById); // Get one
router.put("/employment/:employmentId", updateEmployment); // Update
router.delete("/employment/:employmentId", deleteEmployment); // Delete


export default router;