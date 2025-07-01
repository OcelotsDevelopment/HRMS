import express from "express";
import {
  addDepartment,
  getAllDepartments,
  getAllDepartmentUsers,
  getDepartmentById,
  updateDepartment,
} from "../controller/departmentController.js";
import { verifyToken } from "../middlewares/tokenVerification.js";
import { checkRole } from "../middlewares/checkRole.js";

const router = express.Router();

router.post("/", verifyToken, checkRole(["admin", "hr"]), addDepartment);
router.get("/", getAllDepartments);
router.get("/fetchUser/:id", getAllDepartmentUsers);
router.get("/:id", getDepartmentById);
router.put("/:id", verifyToken, checkRole(["admin", "hr"]), updateDepartment);

export default router;
