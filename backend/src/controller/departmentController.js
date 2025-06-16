import asyncHandler from "express-async-handler";
import {
  addDepartmentService,
  getAllDepartmentsService,
  getAllUsersWithDepartmentService,
  getDepartmentByIdService,
  updateDepartmentService,
} from "../services/department.service.js";

// @desc    Add new department
// @route   POST /api/department/
// @access  Public or Protected (depending on your middleware)
export const addDepartment = asyncHandler(async (req, res) => {
  const result = await addDepartmentService(req.body);
  res.status(201).json(result);
});

// @desc    Get all departments
// @route   GET /api/department
// @access  Public or Protected
export const getAllDepartments = asyncHandler(async (req, res) => {
  const result = await getAllDepartmentsService();
  res.status(200).json(result);
});

// @desc    Get all users under department
// @route   GET /api/usersDepartment
// @access  Public or Protected
export const getAllDepartmentUsers = asyncHandler(async (req, res) => {
  const result = await getAllUsersWithDepartmentService(req.params.id);
  res.status(200).json(result);
});

// @desc    Get department by ID
// @route   GET /api/department/:id
// @access  Public or Protected
export const getDepartmentById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await getDepartmentByIdService(Number(id));
  res.status(200).json(result);
});

// @desc    Update a department
// @route   PUT /api/department/:id
// @access  Public or Protected
export const updateDepartment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await updateDepartmentService(Number(id), req.body);
  res.status(200).json(result);
});
