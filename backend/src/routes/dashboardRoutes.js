
import express from "express";
import { getDashboardOverview } from "../controller/dashboardController.js";

const router = express.Router();

router.get("/overview", getDashboardOverview);

export default router;
