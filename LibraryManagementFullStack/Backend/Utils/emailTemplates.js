export function generateVerificationOtpTemplate(verificationCode){
    return `<html>
    <body style="background-color: #0d0d0d; margin: 0; padding: 0;">
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 40px auto; padding: 30px; border: 1px solid #2e2e2e; border-radius: 12px; background-color: #1a1a1a; box-shadow: 0 0 20px rgba(255, 215, 0, 0.2); color: #f5f5f5;">
        <img src="https://dcassetcdn.com/design_img/3963845/733721/26884483/44b6mxwavvt71x58rpttaasd2c_image.jpg" alt="LibraVault Logo" style="display: block; margin: 0 auto 20px; max-height: 60px;" />
        <h2 style="text-align: center; color: #ffd700; font-size: 26px; margin-bottom: 10px;">Email Verification</h2>
        <p style="text-align: center; color: #e0e0e0; font-size: 16px; margin-top: 10px;">Hello,</p>
        <p style="text-align: center; color: #e0e0e0; font-size: 16px; margin-top: 10px;">Use the OTP below to verify your email for <strong>LibraVault</strong>:</p>
        
        <div style="margin: 30px auto; padding: 20px 40px; background-color: #111; border: 2px dashed #ffd700; width: fit-content; text-align: center; font-size: 32px; font-weight: bold; color: #ffd700; border-radius: 10px; letter-spacing: 10px;">
          ${verificationCode}
        </div>
        <p style="text-align: center; margin-top: 30px; font-size: 14px; color: #888888;">This OTP will expire in 10 minutes. Please do not share it with anyone.</p>
        <p style="text-align: center; margin-top: 10px; font-size: 12px; color: #666666;">This is an automated message, please do not reply.</p>
      </div>
    </body>
    </html>`;
}
// https://img.freepik.com/premium-vector/vault-logo-design-vector-template_773552-700.jpg
// https://dcassetcdn.com/design_img/3963845/733721/26884483/44b6mxwavvt71x58rpttaasd2c_image.jpg

export function generateForgotPasswordEmailTemplate(resetPasswordUrl) {
  return `
    <div class="container">
        <div class="header">
            <h1>Password Reset Request</h1>
        </div>
        <div class="content">
            <p>Dear User,</p>
            <p>We received a request to reset your password. If you made this request, click the button below to reset your password:</p>
            <a href="${resetPasswordUrl}" class="reset-button">Reset My Password</a>
            <p>If you did not request a password reset, you can ignore this email. Your password will remain unchanged.</p>
            <p>This link will expire in 15 minutes for your security.</p>
        </div>
        <div class="footer">
            <p>If you have any questions, feel free to contact our support team at <a href="mailto:support@example.com">support@example.com</a>.</p>
            <p>Thank you for using our service.</p>
        </div>
    </div>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            background-color: #007bff;
            color: white;
            padding: 10px;
            border-radius: 8px 8px 0 0;
        }
        .content {
            padding: 20px;
        }
        .reset-button {
            background-color: #007bff;
            color: white;
            text-decoration: none;
            padding: 12px 20px;
            border-radius: 4px;
            display: inline-block;
            text-align: center;
            font-size: 16px;
            margin-top: 20px;
        }
        .reset-button:hover {
            background-color: #0056b3;
        }
        .footer {
            font-size: 14px;
            color: #777;
            text-align: center;
            margin-top: 30px;
        }
    </style>
    `;
}
