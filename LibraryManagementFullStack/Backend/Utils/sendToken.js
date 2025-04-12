export const sendToken = (user, message, stateCode, res) => {
    const token = user.generateToken();
    const cookieExpireDays = parseInt(process.env.JWT_COOKIE_EXPIRE || "1");
  
    res.status(stateCode).cookie("token", token, {
      expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
      httpOnly: true,
    }).json({
      success: true,
      message,
      token,
      user,
    });
  };
  