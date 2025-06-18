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
  deleteEmploymentService
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
  const result = await getEmploymentByIdService(Number(req.params.employmentId));
  res.status(200).json(result);
});

// @desc    Update employment
// @route   PUT /api/employee/employment/:employmentId
export const updateEmployment = asyncHandler(async (req, res) => {
  const result = await updateEmploymentService(Number(req.params.employmentId), req.body);
  res.status(200).json(result);
});

// @desc    Delete employment
// @route   DELETE /api/employee/employment/:employmentId
export const deleteEmployment = asyncHandler(async (req, res) => {
  const result = await deleteEmploymentService(Number(req.params.employmentId));
  res.status(200).json(result);
});
