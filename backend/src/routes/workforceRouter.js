import { Router } from "express";
import {
  createHolidayController,
  getAllHolidaysController,
  getHolidayByIdController,
  updateHolidayController,
  deleteHolidayController,
} from "../controller/workforceCntroller.js";

const router = Router();


// Holiday
router.get("/holiday", getAllHolidaysController);
router.get("/holiday/:id", getHolidayByIdController);
router.post("/holiday", createHolidayController);
router.put("/holiday/:id", updateHolidayController);
router.delete("/holiday/:id", deleteHolidayController);

export default router;
