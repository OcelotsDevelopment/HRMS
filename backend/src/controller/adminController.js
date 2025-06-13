import asyncHandler from 'express-async-handler';
import {
  createUserService,
  listUsersService,
  editUserService,
  findUserByIdService,
} from '../services/admin.service.js';

// Add User
// // @desc    Add User
// // @route   POST /api/users/add
// // @access  Public
export const addUser = asyncHandler(async (req, res) => {
  try {
    console.log(req.body,"=================");
    
    const newUser = await createUserService(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    console.log(err,"ljsflasjdflasdjflskdfjlsfjlskdfjdlj");
    
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
