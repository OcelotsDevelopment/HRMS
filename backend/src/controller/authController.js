import asyncHandler from "express-async-handler";
import { registerService,loginService } from "../services/auth.service.js";

// // @desc    Authenticate and register Admin
// // @route   POST /api/Admin/auth
// // @access  Public
export const register = asyncHandler(async (req, res) => {
  
  try {
    const result = await registerService(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export const login = async (req, res) => {
  console.log(req.body);
  
  try {
    const result = await loginService(req.body);
    console.log(result,"salkjflaksjflaskdjflsdjk");
    
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

// // @desc    logout Admin
// // @route   POST /api/Admin/auth/logout
// // @access  Public
export const logout = asyncHandler(async (req, res) => {
  // Clear the token cookie
  res.clearCookie('token');
  
  res.status(200).json({ 
    success: true,
    message: "Logged out successfully" 
  });
});
