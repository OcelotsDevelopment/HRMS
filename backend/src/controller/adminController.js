import asyncHandler from "express-async-handler";
import {
  createUserService,
  listUsersService,
  editUserService,
  findUserByIdService,
  addUserEmployment,
  getUserEmployments,
  getUserQualifications,
  getUserPayrolls,
  getUserBankDetails,
  getUserEarningsSummary,
  addUserQualification,
  addUserPayroll,
  addUserBankDetail,
} from "../services/admin.service.js";

// Add User
// // @desc    Add User
// // @route   POST /api/users/add
// // @access  Public
export const addUser = asyncHandler(async (req, res) => {
  try {
    console.log(req.body, "=================");

    const newUser = await createUserService(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    console.log(err, "ljsflasjdflasdjflskdfjlsfjlskdfjdlj");

    res.status(400).json({ error: err.message });
  }
});

// List Users
// // @desc    List User
// // @route   GET /api/users
// // @access  Public
export const listUsers = asyncHandler(async (req, res) => {
  const users = await listUsersService();
  res.status(200).json(users);
});

// Find User By ID
// @desc    Get a single user by ID
// @route   GET /api/admin/user/:id
// @access  Public
export const findUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const user = await findUserByIdService(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// Edit User
// // @desc    Edit User
// // @route   GET /api/users/:id
// // @access  Public
export const editUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const updated = await editUserService(id, req.body);
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Employment

// // @desc    get User Employment
// // @route   GET /api/users/employment/:id
// // @access  Public
export const getUserEmploymentController = asyncHandler(async (req, res) => {
  const result = await getUserEmployments(Number(req.params.id));
  res.status(200).json(result);
});

// // @desc    Add User Employment
// // @route   POST /api/users/employment/
// // @access  Public
export const addUserEmploymentController = asyncHandler(async (req, res) => {
  const result = await addUserEmployment(req.body);
  res.status(201).json(result);
});

// Qualification

// @desc    Get User Qualifications
// @route   GET /api/users/qualification/:id
// @access  Public
export const getUserQualificationController = asyncHandler(async (req, res) => {
  const result = await getUserQualifications(Number(req.params.id));
  res.status(200).json(result);
});

// @desc    add User Qualifications
// @route   POST /api/users/qualification
// @access  Public
export const addUserQualificationController = asyncHandler(async (req, res) => {
  const result = await addUserQualification(req.body);
  res.status(201).json(result);
});

// Payroll

// @desc    Get User Payrolls
// @route   GET /api/users/payroll/:id
// @access  Public
export const getUserPayrollController = asyncHandler(async (req, res) => {
  const result = await getUserPayrolls(Number(req.params.id));
  res.status(200).json(result);
});

// @desc    add User Payrolls
// @route   POST /api/users/payroll
// @access  Public
export const addUserPayrollController = asyncHandler(async (req, res) => {
  const result = await addUserPayroll(req.body);
  res.status(201).json(result);
});


// Bank Details

// @desc    Get User Bank Details
// @route   GET /api/users/bank/:id
// @access  Public
export const getUserBankDetailsController = asyncHandler(async (req, res) => {
  const result = await getUserBankDetails(Number(req.params.id));
  res.status(200).json(result);
});

// @desc    add User Bank Details
// @route   POST /api/users/bank
// @access  Public
export const addUserBankDetailController = asyncHandler(async (req, res) => {
  const result = await addUserBankDetail(req.body);
  res.status(201).json(result);
});


// Earnings Summary

// @desc    Get User Earnings Summary
// @route   GET /api/users/:id/earnings-summary
// @access  Public
export const getUserEarningsSummaryController = asyncHandler(async (req, res) => {
  const result = await getUserEarningsSummary(Number(req.params.id));
  res.status(200).json({ success: true, data: result });
});
