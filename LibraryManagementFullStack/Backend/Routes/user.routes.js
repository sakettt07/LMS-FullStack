import express from 'express';
import { registerUser, verifyOtp,loginUser,logoutUser,userProfile,forgotPassword,resetPassword,updatePassword,getAllUsers,registerAsAdmin } from '../Controllers/user.controller.js';
import { authorizeRoles, isAuthenticated } from '../Middlewares/auth.middleware.js';

const router=express.Router();

router.route('/register').post(registerUser);
router.route('/verify-otp').post(verifyOtp);
router.route('/login').post(loginUser);
router.route('/logout').get(isAuthenticated,logoutUser);
router.route('/me').get(isAuthenticated,userProfile);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);
router.route('/password/update').put(isAuthenticated,updatePassword);

router.route('/admin/users').get(isAuthenticated,authorizeRoles("Admin"),getAllUsers);
router.route('/add/new-admin').post(isAuthenticated,authorizeRoles("Admin"),registerAsAdmin);



export default router;