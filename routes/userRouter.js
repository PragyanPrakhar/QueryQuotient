import express from 'express';
import {signup, login, logout, updateUser,getUsers, getSelfProfile } from '../controllers/user.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();
router.post("/update-user", authenticate, updateUser);
router.get("/users", authenticate, getUsers);
router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);
router.get("/me",authenticate,getSelfProfile);


export default router;