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

  // Bank Details
  createBankDetail,
  updateBankDetail,
  deleteBankDetail,
  getBankDetailsByEmployee,
  getBankDetailById,
  getAllPayrollsController,
  uploadEmployeeImageController,
} from "../controller/employeeController.js";

import { verifyToken } from "../middlewares/tokenVerification.js";
import { checkRole } from "../middlewares/checkRole.js";
import upload from "../utils/multer.js";

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
// Upload employee image route
router.post(
  "/:id/upload-image",
  verifyToken,
  checkRole(["admin", "HR"]),
  upload.single("image"), // uses memory storage
  uploadEmployeeImageController
);
router.delete("/employment/:employmentId", deleteEmployment); // Delete

// Qualification routes
// Qualification routes
router.post("/qualification", addQualification); // Add qualification
router.get("/qualifications/:id", listQualification); // List by employee ID
router.get("/qualification/:id", getQualificationById); // Get one
router.put("/qualification/:qualificationId", updateQualification); // Update

//Payroll
router.post("/payroll", createPayroll);
router.get("/allpayroll/:page/:limit", getAllPayrollsController);
router.get("/payroll/:id", getPayrollById);
router.get("/payrolls/:employeeId", getPayrollsByEmployee);
router.put("/payroll/:id", updatePayroll);
router.delete("/payroll/:id", deletePayroll);

// Bank Details
// Bank Details Routes
router.post("/bank", verifyToken, checkRole(["admin", "HR"]), createBankDetail);
router.put(
  "/bank/:id",
  verifyToken,
  checkRole(["admin", "HR"]),
  updateBankDetail
);
router.delete(
  "/bank/:id",
  verifyToken,
  checkRole(["admin", "HR"]),
  deleteBankDetail
);

// Any authenticated user can view bank details of employees
router.get("/bank/employee/:employeeId", verifyToken, getBankDetailsByEmployee);
router.get("/bank/:id", verifyToken, getBankDetailById);

export default router;
