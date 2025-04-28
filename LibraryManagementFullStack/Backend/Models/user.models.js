import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [30, 'Name cannot exceed 30 characters'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        unique: true,

    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        select: false
    },
    role: {
        type: String,
        enum: ["User", "Admin"],
        default: "User"
    },
    accountVerified:{
        type: Boolean,
        default: false
    },
    borrowedBooks:[{
        bookId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Borrow'
        },
        returned:{
            type: Boolean,
            default: false
        },
        bookTitle:{
            type: String,
        },
        borrowedDate:{
            type: Date,
        },
        dueDate:{
            type: Date,
        },
    }],
    avatar:{
        public_id: String,
        url: String,
    },
    verificationCode:{
        type: Number,
    },
    verificationCodeExpire:{
        type: Date,

    },
    resetPasswordToken:{
        type: String,

    },
    resetPasswordExpire:{
        type: Date,
    },

},{
    timestamps: true,
});

 userSchema.methods.generateVerificationCode=function(){
    function generateRandomFiveDigitCode(){
        const firstDigit = Math.floor(Math.random() * 9) + 1; 
        const remainingDigits = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return parseInt(firstDigit + remainingDigits);
    }
    const verificationCode=generateRandomFiveDigitCode();
    this.verificationCode=verificationCode;
    this.verificationCodeExpire=Date.now() + 5 * 60 * 1000;
    return verificationCode;
 } 

 userSchema.methods.generateToken=function(){
    return jwt.sign({id:this._id}, process.env.JWT_SECRET_KEY, {expiresIn:process.env.JWT_EXPIRES_IN});
  }

  userSchema.methods.getResetPasswordToken=function(){
    const restToken=crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken=crypto
    .createHash('sha256')
    .update(restToken)
    .digest('hex');
    this.resetPasswordExpire=Date.now() + 15 * 60 * 1000;
    return restToken;
  }

 export const User = mongoose.model("User", userSchema);