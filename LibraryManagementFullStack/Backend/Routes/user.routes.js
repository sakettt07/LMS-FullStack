import express from 'express';
import { registerUser } from '../Controllers/user.controller.js';

const router=express.Router();

router.route('/register').post(registerUser);
// router.route('/login').post(loginUser);

export default router;