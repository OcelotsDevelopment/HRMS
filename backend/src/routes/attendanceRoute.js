import express from "express";
import {
  pushBiometricAttendance,
  manualAttendanceEntry,
  getAttendanceLogsByEmployeeId,
  getDailyAttendanceByEmployeeId,
  getAllAttendanceLogs,
  getAllDailyAttendanceController,
  getDailyAttendanceById,
  updateManualAttendanceEntry
} from "../controller/attendanceController.js";

const router = express.Router();

router.post("/biometric", pushBiometricAttendance);

// manual
router.post("/manual", manualAttendanceEntry);
router.put("/manualUpdate/:id", updateManualAttendanceEntry);


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
