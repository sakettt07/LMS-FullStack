import { catchAsyncErrors } from '../Middlewares/catchAsyncErrors.js';
import ErrorHandler from '../Middlewares/error.Middleware.js';
import {User} from '../Models/user.models.js';
import { generateForgotPasswordEmailTemplate } from '../Utils/emailTemplates.js';
import { sendEmail } from '../Utils/sendEmailFunc.js';
import { sendToken } from '../Utils/sendToken.js';
import { sendVerificationCode } from '../Utils/sendVerificationCode.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;
  
    if (!name || !email || !password) {
      return next(new ErrorHandler("Please enter all fields.", 400));
    }
  
    const isRegistered = await User.findOne({ email, accountVerified: true });
    if (isRegistered) {
      return next(new ErrorHandler("User already registered.", 400));
    }
  
    const registrationAttemptsByUser = await User.find({
      email,
      accountVerified: false,
    });
  
    if (registrationAttemptsByUser.length >= 5) {
      return next(
        new ErrorHandler(
          "You have exceeded the maximum number of registration attempts. Please contact support.",
          400
        )
      );
    }
  
    if (password.length < 8 || password.length > 16) {
      return next(
        new ErrorHandler("Password must be between 8 and 16 characters.", 400)
      );
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
  
    const verificationCode = await user.generateVerificationCode();
    await user.save();
  
    try {
      await sendVerificationCode(verificationCode,email);
    } catch (err) {
      console.error("❌ Failed to send verification code:", err.message);
      return next(new ErrorHandler("Failed to send verification email.", 500));
    }
  
    return res.status(200).json({
      success: true,
      message: `Verification code sent to ${email} successfully`,
    });
  });
  
const verifyOtp=catchAsyncErrors(async(req,res,next)=>{
    const { email, verificationCode } = req.body;
  if (!email || !verificationCode) {
    return next(new ErrorHandler("Please enter all fields.", 400));
  }
  try {
    const userAllEntries = await User.find({
      email,
      accountVerified: false,
    }).sort({ createdAt: -1 });
    if (!userAllEntries) {
      return next(new ErrorHandler("No such user found.", 404));
    }
    let user;
    if (userAllEntries.length > 1) {
      user = userAllEntries[0];
      await User.deleteMany({
        email,
        accountVerified: false,
        _id: { $ne: user._id },
      });
    } else {
      user = userAllEntries[0];
    }
    if (user.verificationCode !== Number(verificationCode)) {
      return next(new ErrorHandler("Invalid verificationCode.", 400));
    }
    const currentTime = Date.now();
    const verificationCodeExpire = new Date(
      user.verificationCodeExpire.getTime()
    );
    if (currentTime > verificationCodeExpire) {
      return next(new ErrorHandler("verificationCode expired.", 400));
    }
    user.accountVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpire = null;
    await user.save({ validateModifiedOnly: true });
    sendToken(user, "Account verified successfully",200, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

const loginUser=catchAsyncErrors(async(req,res,next)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return next(new ErrorHandler("Please enter all fields.",400));
        }
        const user=await User.findOne({email,accountVerified:true}).select("+password");
        if(!user){
            return next(new ErrorHandler("Invalid email or password",401));
        }
        const isPasswordMatched=await bcrypt.compare(password,user.password);
        if(!isPasswordMatched){
            return next(new ErrorHandler("Invalid email or password",401));
        }
        sendToken(user,"Login successfully",200,res);
    }
    catch(error){
        return next(new ErrorHandler(error.message,500));
    }
});
const logoutUser=catchAsyncErrors(async(req,res,next)=>{
    try{
        res.cookie("token","",{
            expires:new Date(Date.now()),
            httpOnly:true,
        });
        return res.status(200).json({
            success:true,
            message:"Logout successfully",
        });
    }
    catch(error){
        return next(new ErrorHandler(error.message,500));
    }
});
const userProfile=catchAsyncErrors(async(req,res,next)=>{
    try{
        const user=await User.findById(req.user._id);
        if(!user){
            return next(new ErrorHandler("User not found",404));
        }
        return res.status(200).json({
            success:true,
            user,
        });
    }
    catch(error){
        return next(new ErrorHandler(error.message,500));
    }
});
const forgotPassword=catchAsyncErrors(async(req,res,next)=>{
  if(!req.body.email){
    return next(new ErrorHandler("Please enter all fields",400));
  }
  const user=await User.findOne({
    email:req.body.email,
    accountVerified:true,
  });
  if(!user){
    return next(new ErrorHandler("Invalid Email",404));
  }
  const resetToken=await user.getResetPasswordToken();
  await user.save({validateBeforeSave:false});
  const resetPasswordUrl=`${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
  const message=generateForgotPasswordEmailTemplate(resetPasswordUrl);

  try{
    await sendEmail({
      email:user.email,
      subject:"Library Management System - Password Recovery",
      message,
    });
    return res.status(200).json({
      success:true,
      message:`Email sent to ${user.email} successfully`,
    });
  }
  catch(error){
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;
    await user.save({validateBeforeSave:false});
    return next(new ErrorHandler(error.message,500));
  }

});
const resetPassword=catchAsyncErrors(async(req,res,next)=>{
  const {token}=req.params;
  const {password,confirmPassword}=req.body;
  if(!password || !confirmPassword){
    return next(new ErrorHandler("Please enter all fields",400));
  }
  const resetPasswordToken=crypto.createHash("sha256").update(token).digest("hex");
  const user=await User.findOne({
    resetPasswordToken,
    resetPasswordExpire:{
      $gt:Date.now(),
    },
  });
  if(!user){
    return next(new ErrorHandler("Invalid or expired token",400));
  }
  if(password.length<8 || password.length>16 || confirmPassword.length<8 || confirmPassword.length>16){
    return next(new ErrorHandler("Password must be between 8 and 16 characters",400));
  }
  if(password!==confirmPassword){
    return next(new ErrorHandler("Password does not match",400));
  }
  const hashedPassword=await bcrypt.hash(password,10);
  user.password=hashedPassword;
  user.resetPasswordToken=undefined;
  user.resetPasswordExpire=undefined;
  await user.save();
  sendToken(user,"Password updated successfully",200,res);
});
const updatePassword=catchAsyncErrors(async(req,res,next)=>{
  const user=await User.findById(req.user._id).select("+password");
  const {oldPassword,newPassword,confirmNewPassword}=req.body;
  if(!oldPassword || !newPassword || !confirmNewPassword){
    return next(new ErrorHandler("Please enter all fields",400));
  }
  if(newPassword.length<8 || newPassword.length>16 || confirmNewPassword.length<8 || confirmNewPassword.length>16){
    return next(new ErrorHandler("Password must be between 8 and 16 characters",400));
  }
  if(newPassword!==confirmNewPassword){
    return next(new ErrorHandler("Password does not match",400));
  }
  const isPasswordMatched=await bcrypt.compare(oldPassword,user.password);
  if(!isPasswordMatched){
    return next(new ErrorHandler("Old password is incorrect",400));
  }
  const hashedPassword=await bcrypt.hash(newPassword,10);
  user.password=hashedPassword;
  await user.save();
  return res.status(200).json({
    success:true,
    message:"Password updated successfully",
  });

});
const getAllUsers=catchAsyncErrors(async(req,res,next)=>{
  const users=await User.find({accountVerified:true});
  if(!users){
    return next(new ErrorHandler("No users found",404));
  }
  return res.status(200).json({
    success:true,
    users,
  });
});
export {registerUser,verifyOtp,loginUser,logoutUser,userProfile,forgotPassword,resetPassword,updatePassword,getAllUsers};