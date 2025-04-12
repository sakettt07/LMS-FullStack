import express from 'express';
import { registerUser, verifyOtp,loginUser,logoutUser,userProfile } from '../Controllers/user.controller.js';
import { isAuthenticated } from '../Middlewares/auth.middleware.js';

const router=express.Router();

router.route('/register').post(registerUser);
router.route('/verify-otp').post(verifyOtp);
router.route('/login').post(loginUser);
router.route('/logout').get(isAuthenticated,logoutUser);
router.route('/me').get(isAuthenticated,userProfile);


export default router;