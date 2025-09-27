import asyncHandler from "express-async-handler";
import {
  pushBiometricAttendanceService,
  manualAttendanceEntryService,
  getAttendanceLogsByEmployeeIdService,
  getDailyAttendanceByEmployeeIdService,
  getAllAttendanceLogsService,
  getAllDailyAttendanceService,
  getDailyAttendanceByIdService,
  updateManualAttendanceEntryService,
} from "../services/attendance.service.js";

// @desc    Push biometric attendance (IN/OUT)
/// @route   POST /api/attendance/biometric
// handleBiometricWebhook
export const pushBiometricAttendance = async (req, res) => {
  try {
    const result = await pushBiometricAttendanceService(req.body);
    return res.status(200).json({ message: "Punch recorded", ...result });
  } catch (error) {
    console.error("Biometric push error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Manually enter attendance for employee
// @route   POST /api/attendance/manual
export const manualAttendanceEntry = asyncHandler(async (req, res) => {
  const result = await manualAttendanceEntryService(req.body);
  res.status(201).json(result);
});

// @desc    Manually enter attendance for employee
// @route   POST /api/attendance/manual
export const updateManualAttendanceEntry = asyncHandler(async (req, res) => {
  console.log(
    req.params.id,
    "req.params.idreq.params.idreq.params.idreq.params.id"
  );

  const result = await updateManualAttendanceEntryService(
    req.params.id,
    req.body
  );
  res.status(201).json(result);
});

// @desc    Get all biometric/manual logs for an employee
// @route   GET /api/attendance/logs/:employeeId
export const getAttendanceLogsByEmployeeId = asyncHandler(async (req, res) => {
  const result = await getAttendanceLogsByEmployeeIdService(
    req.params.employeeId
  );
  res.status(200).json(result);
});

// @desc    Get daily summaries for an employee
// @route   GET /api/attendance/daily/:employeeId
export const getDailyAttendanceByEmployeeId = asyncHandler(async (req, res) => {
  const result = await getDailyAttendanceByEmployeeIdService(
    Number(req.params.id)
  );
  res.status(200).json(result);
});

// @desc    Get all employees' attendance logs
// @route   GET /api/attendance/logs
export const getAllAttendanceLogs = asyncHandler(async (req, res) => {
  const result = await getAllAttendanceLogsService();
  res.status(200).json(result);
});

// controllers/attendanceController.js
export const getAllDailyAttendanceController = async (req, res) => {
  try {
    const { date, page = 1, limit = 10 } = req.query;

    const result = await getAllDailyAttendanceService({
      date,
      page: Number(page),
      limit: Number(limit),
    });

    res.status(200).json({
      success: true,
      data: result.data,
      total: result.total,
    });
  } catch (error) {
    console.error("Error fetching daily attendance:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch daily attendance",
    });
  }
};

// @desc    Get a single daily attendance entry by ID
// @route   GET /api/attendance/daily/id/:id
// @access  Private
export const getDailyAttendanceById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await getDailyAttendanceByIdService(id);

  res.status(200).json(result);
});
