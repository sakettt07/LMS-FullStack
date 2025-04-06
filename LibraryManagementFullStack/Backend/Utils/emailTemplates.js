export function generateVerificationOtpTemplate(otpCode){
    return `<html>
    <body style="background-color: #0d0d0d; margin: 0; padding: 0;">
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 40px auto; padding: 30px; border: 1px solid #2e2e2e; border-radius: 12px; background-color: #1a1a1a; box-shadow: 0 0 20px rgba(255, 215, 0, 0.2); color: #f5f5f5;">
        <img src="https://dcassetcdn.com/design_img/3963845/733721/26884483/44b6mxwavvt71x58rpttaasd2c_image.jpg" alt="LibraVault Logo" style="display: block; margin: 0 auto 20px; max-height: 60px;" />
        <h2 style="text-align: center; color: #ffd700; font-size: 26px; margin-bottom: 10px;">Email Verification</h2>
        <p style="text-align: center; color: #e0e0e0; font-size: 16px; margin-top: 10px;">Hello,</p>
        <p style="text-align: center; color: #e0e0e0; font-size: 16px; margin-top: 10px;">Use the OTP below to verify your email for <strong>LibraVault</strong>:</p>
        
        <div style="margin: 30px auto; padding: 20px 40px; background-color: #111; border: 2px dashed #ffd700; width: fit-content; text-align: center; font-size: 32px; font-weight: bold; color: #ffd700; border-radius: 10px; letter-spacing: 10px;">
          ${otpCode}
        </div>
        <p style="text-align: center; margin-top: 30px; font-size: 14px; color: #888888;">This OTP will expire in 10 minutes. Please do not share it with anyone.</p>
        <p style="text-align: center; margin-top: 10px; font-size: 12px; color: #666666;">This is an automated message, please do not reply.</p>
      </div>
    </body>
    </html>`;
}
// https://img.freepik.com/premium-vector/vault-logo-design-vector-template_773552-700.jpg
// https://dcassetcdn.com/design_img/3963845/733721/26884483/44b6mxwavvt71x58rpttaasd2c_image.jpg