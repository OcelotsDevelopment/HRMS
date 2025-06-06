import express from "express";
import {
  addDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
} from "../controller/departmentController.js";

const router = express.Router();

router.post("/", addDepartment);
router.get("/", getAllDepartments);
router.get("/:id", getDepartmentById);
router.put("/:id", updateDepartment);

export default router;
