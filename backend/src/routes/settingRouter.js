import { Router } from "express";
import {
  createRegionController,
  getAllRegionsController,
  getRegionByIdController,
  updateRegionController,
  deleteRegionController,

  // holiday
  createHolidayTypeController,
  getAllHolidayTypesController,
  getHolidayTypeByIdController,
  updateHolidayTypeController,
  deleteHolidayTypeController,
} from "../controller/settingController.js";

const router = Router();

router.get("/region", getAllRegionsController);
router.get("/region/:id", getRegionByIdController);
router.post("/region", createRegionController);
router.put("/region/:id", updateRegionController);
router.delete("/region/:id", deleteRegionController);

// Holiday
router.get("/holiday-type", getAllHolidayTypesController);
router.get("/holiday-type/:id", getHolidayTypeByIdController);
router.post("/holiday-type", createHolidayTypeController);
router.put("/holiday-type/:id", updateHolidayTypeController);
router.delete("/holiday-type/:id", deleteHolidayTypeController);

export default router;
