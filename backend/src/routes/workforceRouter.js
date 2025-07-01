import { Router } from "express";
import {
  createHolidayController,
  getAllHolidaysController,
  getHolidayByIdController,
  updateHolidayController,
  deleteHolidayController,
  // leave
  createLeaveController,
  getAllLeavesController,
  getLeaveByIdController,
  updateLeaveController,
  deleteLeaveController,

  // Events
  createEventController,
  getAllEventsController,
  getEventByIdController,
  updateEventController,
  deleteEventController,
  getLeavesByEmployee,
  getAllPendingLeavesController,

   // CompOff
  createCompOffController,
  getAllCompOffsController,
  getCompOffByIdController,
  updateCompOffController,
  deleteCompOffController,
  updateCompOffStatusController,
} from "../controller/workforceController.js";

const router = Router();

// Holiday
router.get("/holiday", getAllHolidaysController);
router.get("/holiday/:id", getHolidayByIdController);
router.post("/holiday", createHolidayController);
router.put("/holiday/:id", updateHolidayController);
router.delete("/holiday/:id", deleteHolidayController);

// Leave

// Leave Endpoints
router.get("/leave", getAllLeavesController);
router.get("/pendingLeave", getAllPendingLeavesController);

router.get("/leave/:id", getLeaveByIdController);
router.get("/leave/leave-by-employee/:id", getLeavesByEmployee);
router.post("/leave", createLeaveController);
router.put("/leave/:id", updateLeaveController);
router.delete("/leave/:id", deleteLeaveController);

//  Event Routes
router.get("/event", getAllEventsController);
router.get("/event/:id", getEventByIdController);
router.post("/event", createEventController);
router.put("/event/:id", updateEventController);
router.delete("/event/:id", deleteEventController);

// CompOff Routes
router.get("/compoff", getAllCompOffsController);
router.get("/compoff/:id", getCompOffByIdController);
router.post("/compoff", createCompOffController);
router.put("/compoff/:id", updateCompOffController);
router.delete("/compoff/:id", deleteCompOffController);
router.patch("/compoff/:id", updateCompOffStatusController);

export default router;
