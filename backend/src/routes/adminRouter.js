import express from 'express';
import { addUser, listUsers, editUser, findUserById } from '../controller/adminController.js';

const router = express.Router();

router.post('/user/add', addUser); // POST /api/admin/users/add
router.get('/user', listUsers);   // GET /api/admin/users
router.get('/user/:id', findUserById); //GET /api/admin/user/:id
router.put('/user/:id', editUser); // PUT /api/admin/users/:id

export default router;
