import asyncHandler from "express-async-handler";
import {
  createEmployeeService,
  getAllEmployeesService,
  getEmployeeByIdService,
  updateEmployeeService,
  // Employment
  addEmploymentService,
  listEmploymentService,
  getEmploymentByIdService,
  updateEmploymentService,
  deleteEmploymentService,

  // qualification
  addQualificationService,
  listQualificationService,
  getQualificationByIdService,
  updateQualificationService,
  createPayrollService,
  getPayrollByIdService,
  getPayrollsByEmployeeService,
  updatePayrollService,
  deletePayrollService,
  
  // Payroll

} from "../services/employee.service.js";

// @desc    Create new employee
// @route   POST /api/employee
export const createEmployee = asyncHandler(async (req, res) => {
  console.log(req.body,"dfkshdflkhsdlf");
  
  const result = await createEmployeeService(req.body);
  res.status(201).json(result);
});

// @desc    Get all employees
// @route   GET /api/employee
export const getAllEmployees = asyncHandler(async (req, res) => {
  const result = await getAllEmployeesService();
  res.status(200).json(result);
});

// @desc    Get employee by ID
// @route   GET /api/employee/:id
export const getEmployeeById = asyncHandler(async (req, res) => {
  const result = await getEmployeeByIdService(Number(req.params.id));
  res.status(200).json(result);
});

// @desc    Update employee
// @route   PUT /api/employee/:id
export const updateEmployee = asyncHandler(async (req, res) => {
  const result = await updateEmployeeService(Number(req.params.id), req.body);
  res.status(200).json(result);
});


// @desc    Add employment for an employee
// @route   POST /api/employee/:id/employment
export const addEmployment = asyncHandler(async (req, res) => {
  const result = await addEmploymentService(req.body);
  res.status(201).json(result);
});

// @desc    List all employments for an employee
// @route   GET /api/employee/:id/employment
export const listEmployment = asyncHandler(async (req, res) => {
  const result = await listEmploymentService(Number(req.params.id));
  res.status(200).json(result);
});

// @desc    Get single employment by ID
// @route   GET /api/employee/employment/:employmentId
export const getEmploymentById = asyncHandler(async (req, res) => {
  const result = await getEmploymentByIdService(Number(req.params.id));
  res.status(200).json(result);
});

// @desc    Update employment
// @route   PUT /api/employee/employment/:employmentId
export const updateEmployment = asyncHandler(async (req, res) => {

  const employmentId = Number(req.params.employmentId);

  console.log(typeof employmentId,"empIdempIdempIdempIdempIdempIdempId");
  
  if (isNaN(employmentId)) {
    res.status(400).json({ message: "Invalid employment ID" });
    return;
  }

  const result = await updateEmploymentService(employmentId, req.body);
  res.status(200).json(result);
});


// @desc    Delete employment
// @route   DELETE /api/employee/employment/:employmentId
export const deleteEmployment = asyncHandler(async (req, res) => {
  const result = await deleteEmploymentService(Number(req.params.employmentId));
  res.status(200).json(result);
});


// @desc Add qualification
// @route   POST /api/employee/qualification/
export const addQualification = asyncHandler(async (req, res) => {
  const result = await addQualificationService(req.body);
  res.status(201).json(result);
});

// @desc List all qualifications for an employee
// @route   Get /api/employee/qualifications/
export const listQualification = asyncHandler(async (req, res) => {
  const result = await listQualificationService(Number(req.params.id));
  res.status(200).json(result);
});

// @desc Get single qualification by ID
// @route   Get /api/employee/qualification/:qualificationId
export const getQualificationById = asyncHandler(async (req, res) => {
  const result = await getQualificationByIdService(Number(req.params.id));
  res.status(200).json(result);
});

// @desc Update qualification
// @route   PUT /api/employee/qualification/:qualificationId
export const updateQualification = asyncHandler(async (req, res) => {
  const result = await updateQualificationService(
    Number(req.params.qualificationId),
    req.body
  );
  res.status(200).json(result);
});


//      Payroll


// @desc    Add single employment by ID
// @route   POST /api/employee/payroll/
export const createPayroll = asyncHandler(async (req, res) => {
  const result = await createPayrollService(req.body);
  res.status(201).json(result);
});


// @desc    Fetch single employment by ID
// @route   GET /api/employee/payrollById/:id
export const getPayrollById = asyncHandler(async (req, res) => {
  const result = await getPayrollByIdService(Number(req.params.id));
  res.status(200).json(result);
});

// @desc    Fetch single employment by ID
// @route   GET /api/employee/payroll/
export const getPayrollsByEmployee = asyncHandler(async (req, res) => {
  const result = await getPayrollsByEmployeeService(Number(req.params.employeeId));
  res.status(200).json(result);
});

// @desc    Edit single employment by ID
// @route   PUT /api/employee/payroll/update
export const updatePayroll = asyncHandler(async (req, res) => {
  const result = await updatePayrollService(Number(req.params.id), req.body);
  res.status(200).json(result);
});

// @desc    Delete single employment by ID
// @route   DELETE /api/employee/payroll/delete
export const deletePayroll = asyncHandler(async (req, res) => {
  const result = await deletePayrollService(Number(req.params.id));
  res.status(200).json(result);
});