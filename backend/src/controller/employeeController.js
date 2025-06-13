import asyncHandler from "express-async-handler";
import {
  createEmployeeService,
  getAllEmployeesService,
  getEmployeeByIdService,
  updateEmployeeService,
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
