import { generateVerificationOtpTemplate } from "./emailTemplates.js";
import { sendEmail } from "./sendEmailFunc.js";

export async function sendVerificationCode(verificationCode, email) {
  try {
    if (!email) throw new Error("Email is missing");

    const message = generateVerificationOtpTemplate(verificationCode);

    await sendEmail({
      email,
      subject: "Verification Code - Library Management System Verification Code",
      message,
    });

  } catch (error) {
    // Re-throw the error to be caught in the controller
    throw new Error("Verification code sending failed");
  }
}
