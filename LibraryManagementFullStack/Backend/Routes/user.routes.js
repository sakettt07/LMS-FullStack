import express from 'express';
import { registerUser, verifyOtp } from '../Controllers/user.controller.js';

const router=express.Router();

router.route('/register').post(registerUser);
router.route('/verify-otp').post(verifyOtp);
// router.route('/login').post(loginUser);

export default router;