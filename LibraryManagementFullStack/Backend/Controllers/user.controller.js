import ApiError from '../Middlewares/Error.Middleware.js';
import {User} from '../Models/user.models.js';
import { asyncHandler } from '../Utils/asyncHandler.js';
import { sendVerificationCode } from '../Utils/sendVerificationCode.js';


const registerUser=asyncHandler(async (req,res)=>{
    const {name,email,password}=req.body;
    if(!name || !email || !password){
        throw new ApiError('Please provide all the fields',400);
    }
    const isRegistered=await User.findOne({email,accountVerified:true});
    if(isRegistered){
        throw new ApiError('User already registered',400);
    }
    // for handling the number of attempts he made to register
    const registerAttemptsMade=await User.find({
        email,
        accountVerified:false
    });
    if(registerAttemptsMade.length>=5){
        throw new ApiError('You have made too many attempts to register',400);
    }
    if(password.length<8 || password.length>20){
        throw new ApiError('Password must be between 8 and 20 characters',400);
    }
    const user=await User.create({
        name,
        email,
        password,
    });
    // now we will be generating a verification code to its email
    const verificationCode=await user.genrerateVerificationCode();
    await user.save();
    sendVerificationCode(verificationCode,email,res);

});
const verifyOtp=asyncHandler(async(req,res)=>{
    const {email,verificationCode}=req.body;
    if(!email || !verificationCode){
        throw new ApiError('Please provide all the fields',400);
    }
    const userEntries=await User.find({
        email,
        accountVerified:false
    }).sort({createdAt:-1});
    if(!userEntries){
        throw new ApiError('No such user found',404);
    }
    let user;
    if(userEntries.length> 1){
        user=userEntries[0];
        await User.deleteMany({
            _id:{
                $ne:user._id
            },
            email,
            accountVerified:false
        })

    }
    else{
        user=userEntries[0];
    }
    if(user.verificationCode!==Number(verificationCode)){
        throw new ApiError('Invalid verification code',400);
    }
    const currentTime=Date.now();
    const verificationCodeExpire=new Date(user.verificationCodeExpire).getTime();
    if(currentTime>verificationCodeExpire){
        throw new ApiError('Verification code expired',400);
    }
    user.accountVerified=true;
    user.verificationCode=null;
    user.verificationCodeExpire=null;
    await user.save({validateModifiedOnly:true});
    sendToken(user,200,"Account Verified",res);
})
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