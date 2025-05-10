import { asyncHandler } from "../Utils/asyncHandler.js";
import { ApiError } from "../Utils/Api.Error.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { User } from '../Models/user.models.js';
import { generateForgotPasswordEmailTemplate } from '../Utils/emailTemplates.js';
import { sendEmail } from '../Utils/sendEmailFunc.js';
import { sendToken } from '../Utils/sendToken.js';
import { sendVerificationCode } from '../Utils/sendVerificationCode.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { v2 as cloudinary } from 'cloudinary';

const registerUser = asyncHandler(async (req, res, next) => {

  if (!req.files || Object.keys(req.files).length === 0) {
    throw new ApiError(400, "Avatar Image Required");
  };
  const { avatar } = req.files;
  const allowedFormats = ['image/jpeg', 'image/png', 'image/jpg'];
  if (!allowedFormats.includes(avatar.mimetype)) {
    throw new ApiError(400, "File format not supported");
  }
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "Please enter all fields");
  }

  const isRegistered = await User.findOne({ email, accountVerified: true });
  if (isRegistered) {
    throw new ApiError(400, "User already registered");
  }

  const registrationAttemptsByUser = await User.find({
    email,
    accountVerified: false,
  });

  if (registrationAttemptsByUser.length >= 5) {
    throw new ApiError(400, "Maximum registration attempts reached. Please contact support.");
  }

  if (password.length < 8 || password.length > 16) {
    throw new ApiError(400, "Password must be between 8 and 16 characters");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const cloudinaryResponse = await cloudinary.uploader.upload(avatar.tempFilePath, {
    folder: 'LibraryManagement/Users',
  });
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    throw new ApiError(500, `Image upload failed || ${cloudinaryResponse.error}`);
  }

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    avatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    }
  });

  const verificationCode = await user.generateVerificationCode();
  await user.save();

  try {
    await sendVerificationCode(verificationCode, email);
  } catch (err) {
    console.error("Failed to send verification code:", err.message);
    return next(new ErrorHandler("Failed to send verification email.", 500));
  }

  return res.status(200).json({
    success: true,
    message: `Verification code sent to ${email} successfully`,
  });
});

const verifyOtp = asyncHandler(async (req, res, next) => {
  const { email, verificationCode } = req.body;
  if (!email || !verificationCode) {
    throw new ApiError(400, "Please enter all fields");
  }
  try {
    const userAllEntries = await User.find({
      email,
      accountVerified: false,
    }).sort({ createdAt: -1 });
    if (!userAllEntries) {
      throw new ApiError(404, "User not found");
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
      throw new ApiError(400, "Invalid verification code");
    }
    const currentTime = Date.now();
    const verificationCodeExpire = new Date(
      user.verificationCodeExpire.getTime()
    );
    if (currentTime > verificationCodeExpire) {
      throw new ApiError(400, "Verification code expired");
    }
    user.accountVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpire = null;
    await user.save({ validateModifiedOnly: true });
    sendToken(user, "Account verified successfully", 200, res);
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ApiError(400, "Please enter all fields");
    }
    const user = await User.findOne({ email, accountVerified: true }).select("+password");
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      throw new ApiError(400, "Invalid credentials");
    }
    sendToken(user, "Login successfully", 200, res);
  });
const logoutUser = asyncHandler(async (req, res, next) => {
    res.cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    return res.status(200).json(new ApiResponse(200, null, "Logged out successfully"));
});
const userProfile = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    return res.status(200).json(new ApiResponse(200, user, "User profile fetched successfully"));
});
const forgotPassword = asyncHandler(async (req, res, next) => {
  if (!req.body.email) {
    throw new ApiError(400, "Please enter all fields");
  }
  const user = await User.findOne({
    email: req.body.email,
    accountVerified: true,
  });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const resetToken = await user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
  const message = generateForgotPasswordEmailTemplate(resetPasswordUrl);

  try {
    await sendEmail({
      email: user.email,
      subject: "Library Management System - Password Recovery",
      message,
    });
    return res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  }
  catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }

});
const resetPassword = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;
  if (!password || !confirmPassword) {
    throw new ApiError(400, "Please enter all fields");
  }
  const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: {
      $gt: Date.now(),
    },
  });
  if (!user) {
    throw new ApiError(400, "Invalid or expired token");
  }
  if (password.length < 8 || password.length > 16 || confirmPassword.length < 8 || confirmPassword.length > 16) {
    throw new ApiError(400, "Password must be between 8 and 16 characters");
  }
  if (password !== confirmPassword) {
    throw new ApiError(400, "Password does not match");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendToken(user, "Password updated successfully", 200, res);
});
const updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");
  const { oldPassword, newPassword, confirmNewPassword } = req.body;
  if (!oldPassword || !newPassword || !confirmNewPassword) {
    throw new ApiError(400, "Please enter all fields");
  }
  if (newPassword.length < 8 || newPassword.length > 16 || confirmNewPassword.length < 8 || confirmNewPassword.length > 16) {
    throw new ApiError(400, "Password must be between 8 and 16 characters");
  }
  if (newPassword !== confirmNewPassword) {
    throw new ApiError(400, "Password does not match");
  }
  const isPasswordMatched = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordMatched) {
   throw new ApiError(400, "Old password is incorrect");
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();
  return res.status(200).json(new ApiResponse(200, null, "Password updated successfully"));

});
const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find({ accountVerified: true }).select("-borrowedBooks -verificationCode -verificationCodeExpire -resetPasswordToken -resetPasswordExpire -password -createdAt -updatedAt -__v");
  if (!users) {
    throw new ApiError(404, "No users found");
  }
  return res.status(200).json(new ApiResponse(200, users, "Users fetched successfully"));
});

const registerAsAdmin = asyncHandler(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    throw new ApiError(400, "Avatar Image Required");
  }
  const { avatar } = req.files;
  const allowedFormats = ['image/jpeg', 'image/png', 'image/jpg'];
  if (!allowedFormats.includes(avatar.mimetype)) {
    return new ApiError(400, "File format not supported");
  }
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new ApiError(400, "Please enter all fields");
  };
  const isRegistered = await User.findOne({ email, accountVerified: true });
  if (isRegistered) {
    throw new ApiError(400, "User already registered");
  }

  if (password.length < 8 || password.length > 16) {
    throw new ApiError(400, "Password must be between 8 and 16 characters");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const cloudinaryResponse = await cloudinary.uploader.upload(avatar.tempFilePath, {
    folder: 'LibraryManagement/Users',
  });
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    throw new ApiError(500, `Image upload failed || ${cloudinaryResponse.error}`);
  }
  const admin = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "Admin",
    avatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });
  if(!admin) {
    await cloudinary.uploader.destroy(cloudinaryResponse.public_id);
    throw new ApiError(500, "Error creating admin");
  }

  return res.status(201).json(new ApiResponse(200, admin, "Admin registered successfully"));


});
export { registerUser, verifyOtp, loginUser, logoutUser, userProfile, forgotPassword, resetPassword, updatePassword, getAllUsers, registerAsAdmin };