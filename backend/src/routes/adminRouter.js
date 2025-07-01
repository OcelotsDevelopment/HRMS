import express from "express";
import {
  addUser,
  listUsers,
  editUser,
  findUserById,
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

export default router;
