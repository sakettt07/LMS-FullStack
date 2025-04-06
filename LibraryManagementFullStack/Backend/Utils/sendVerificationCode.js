import { generateVerificationOtpTemplate } from "./emailTemplates.js";
import { sendEmail } from "./sendEmailFunc.js";

export async function sendVerificationCode(verificationCode,email, res) {
    try{
        const message=generateVerificationOtpTemplate(verificationCode);
        sendEmail({
            email,
            subject: "Library Management System Verification Code",
            message,
        })
        res.status(200).json({
            success: true,
            message: "Verification code sent successfully",
        });
    }
    catch (error) {
        throw new ApiError("Failed to send verification code", 500);
    }
}