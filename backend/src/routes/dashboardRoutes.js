
import express from "express";
import { getDashboardOverview } from "../controller/dashboardController.js";
import { verifyToken } from "../middlewares/tokenVerification.js";
import { checkRole } from "../middlewares/checkRole.js";

const router = express.Router();

router.get("/overview", verifyToken,
  checkRole(["admin", "hr"]), getDashboardOverview);

export default router;
