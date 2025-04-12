import { catchAsyncErrors } from "./catchAsyncErrors.js";
import jwt from "jsonwebtoken";
import ErrorHandler from "./error.Middleware.js";
import { User } from "../Models/user.models.js";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }
  const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
  console.log(decodedData);
  req.user = await User.findById(decodedData.id);

  next();
});