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
        required: true,
    },
    verificationCodeExpire:{
        type: Date,
        required: true,
    },
    resetPasswordToken:{
        type: String,
        required: true,
    },
    resetPasswordExpire:{
        type: Date,
        required: true,
    },

},{
    timestamps: true,
});

export const User = mongoose.model('User', userSchema);