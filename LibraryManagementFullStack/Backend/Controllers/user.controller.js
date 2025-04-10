import ApiError from '../Middlewares/Error.Middleware.js';
import {User} from '../Models/user.models.js';
import { asyncHandler } from '../Utils/asyncHandler.js';
import { sendToken } from '../Utils/sendToken.js';
import { sendVerificationCode } from '../Utils/sendVerificationCode.js';


const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw new ApiError('Please provide all the fields', 400);
    }
    if (password.length < 8 || password.length > 20) {
        throw new ApiError('Password must be between 8 and 20 characters', 400);
    }
    const isRegistered = await User.findOne({ email, accountVerified: true });
    if (isRegistered) {
        throw new ApiError('User already registered', 400);
    }
    const unverifiedUsers = await User.find({ email, accountVerified: false }).sort({ createdAt: -1 });

    if (unverifiedUsers.length >= 5) {
        throw new ApiError('You have made too many attempts to register', 400);
    }

    const latestAttempt = unverifiedUsers[0];

    if (latestAttempt) {
        await User.deleteMany({
            _id: { $nin: [latestAttempt._id] },
            email,
            accountVerified: false
        });
        if (latestAttempt.verificationCodeExpire < Date.now()) {
            latestAttempt.name = name;
            latestAttempt.password = password;
            const verificationCode = latestAttempt.generateVerificationCode();
            await latestAttempt.save();
            return await sendVerificationCode(verificationCode, email, res);
        } else {
            throw new ApiError('A verification code was already sent. Please wait before trying again.', 400);
        }
    }
    const user = await User.create({ name, email, password });
    const verificationCode = user.generateVerificationCode();
    await user.save();

    await sendVerificationCode(verificationCode, email, res);
});


const verifyOtp = asyncHandler(async (req, res) => {
    const { email, verificationCode } = req.body || {};

    if (!email || !verificationCode) {
        throw new ApiError('Email and OTP is required for verification', 400);
    }

    const userEntries = await User.find({
        email,
        accountVerified: false
    }).sort({ createdAt: -1 });

    if (!userEntries || userEntries.length === 0) {
        throw new ApiError('No such user found', 404);
    }

    let user = userEntries[0];

    if (userEntries.length > 1) {
        await User.deleteMany({
            _id: { $ne: user._id },
            email,
            accountVerified: false
        });
    }

    if (String(user.verificationCode) !== String(verificationCode)) {
        throw new ApiError('Invalid verification code', 400);
    }

    const currentTime = Date.now();
    const codeExpiry = new Date(user.verificationCodeExpire).getTime();

    if (currentTime > codeExpiry) {
        throw new ApiError('Verification code expired', 400);
    }

    user.accountVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpire = null;

    await user.save({ validateModifiedOnly: true });

    return sendToken(user, 200, "Account Verified", res);
});

const loginUser=asyncHandler(async(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        throw new ApiError('Please provide all the fields',400);
    }
    const user=await User.findOne({email}).select('+password');
    if(!user){
        throw new ApiError('Invalid credentials',401);
    }
    const isMatched=await user.comparePassword(password);
    if(!isMatched){
        throw new ApiError('Invalid credentials',401);
    }
    sendToken(user,200,res);
})
export {registerUser,loginUser,verifyOtp};