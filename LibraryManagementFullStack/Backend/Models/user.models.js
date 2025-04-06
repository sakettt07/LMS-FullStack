import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

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
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isActive: {
        type: Boolean,
        default: true
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
            required: true
        },
        borrowedDate:{
            type: Date,
            default: Date.now
        },
        dueDate:{
            type: Date,
            required: true
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

// before saving the user lets hash the password

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  });
  // when the user enters its password it will match the exisiting for the login purposes
  userSchema.methods.comparepassword=async function(password){
    return await bcrypt.compare(password, this.password);
  }
 userSchema.methods.genrerateVerificationCode=function(){
    function genrerateRandomFiveDigitCode(){
        const firstDigit = Math.floor(Math.random() * 9) + 1; 
        const remainingDigits = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return parseInt(firstDigit.toString() + remainingDigits);
    }
    const verificationCode=genrerateRandomFiveDigitCode();
    this.verificationCode=verificationCode;
    this.verificationCodeExpire=Date.now() + 2 * 60 * 1000;
    return verificationCode;
 } 

 export const User = mongoose.model("User", userSchema);