import express from "express";
import {
  pushBiometricAttendance,
  manualAttendanceEntry,
  getAttendanceLogsByEmployeeId,
  getDailyAttendanceByEmployeeId,
  getAllAttendanceLogs,
  getAllDailyAttendanceController,
  getDailyAttendanceById,
  updateManualAttendanceEntry,
} from "../controller/attendanceController.js";
import { verifyToken } from "../middlewares/tokenVerification.js";
import { checkRole } from "../middlewares/checkRole.js";

const router = express.Router();

router.post("/biometric", pushBiometricAttendance);

// manual
router.post(
  "/manual",
  verifyToken,
  checkRole(["admin", "hr"]),
  manualAttendanceEntry
);
router.put(
  "/manualUpdate/:id",
  verifyToken,
  checkRole(["admin", "hr"]),
  updateManualAttendanceEntry
);

// GET attendance logs
router.get("/logs/:employeeId", getAttendanceLogsByEmployeeId);

// GET daily attendance summaries
router.get("/daily/:id", getDailyAttendanceByEmployeeId);

// GET /api/attendance/logs - fetch all logs for all employees
router.get("/logs", getAllAttendanceLogs);

// routes/attendanceRoutes.js
router.get("/daily", getAllDailyAttendanceController);

router.get("/attendance/daily/id/:id", getDailyAttendanceById);

export default router;
