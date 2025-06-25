import asyncHandler from "express-async-handler";
import { getDashboardOverviewService } from "../services/dashboard.service.js";

// @desc    Get dashboard overview data
// @route   GET /api/dashboard/overview
export const getDashboardOverview = asyncHandler(async (req, res) => {
  const data = await getDashboardOverviewService();
  res.status(200).json({ success: true, data });
});
