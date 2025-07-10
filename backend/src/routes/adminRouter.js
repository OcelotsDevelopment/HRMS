import express from "express";
import {
  addUser,
  listUsers,
  editUser,
  findUserById,
  getUserEmploymentController,
  addUserEmploymentController,
  getUserQualificationController,
  getUserPayrollController,
  getUserBankDetailsController,
  getUserEarningsSummaryController,
  addUserQualificationController,
  addUserPayrollController,
  addUserBankDetailController,
} from "../controller/adminController.js";
import { checkRole } from "../middlewares/checkRole.js";
import { verifyToken } from "../middlewares/tokenVerification.js";

const router = express.Router();

// POST /api/admin/users/add
router.post("/user/add", verifyToken, checkRole(["admin"]), addUser);
// GET /api/admin/users
router.get("/user", verifyToken, checkRole(["admin"]), listUsers);
//GET /api/admin/user/:id
router.get("/user/:id", verifyToken, checkRole(["admin"]), findUserById);
// PUT /api/admin/users/:id
router.put("/user/:id", verifyToken, checkRole(["admin"]), editUser);

router.get(
  "/:id/employment",
  verifyToken,
  checkRole(["admin"]),
  getUserEmploymentController
);
router.post(
  "/:id/employment",
  verifyToken,
  checkRole(["admin"]),
  addUserEmploymentController
);

// Qualifications
router.get("/qualification/:id", getUserQualificationController);
router.post(
  "/qualification",
  verifyToken,
  checkRole(["admin"]),
  addUserQualificationController
);

// Payrolls
router.get("/payroll/:id", getUserPayrollController);
router.post(
  "/payroll",
  verifyToken,
  checkRole(["admin"]),
  addUserPayrollController
);

// Bank Details
router.get("/bank/:id", getUserBankDetailsController);
router.post(
  "/bank",
  verifyToken,
  checkRole(["admin"]),
  addUserBankDetailController
);

export default router;
