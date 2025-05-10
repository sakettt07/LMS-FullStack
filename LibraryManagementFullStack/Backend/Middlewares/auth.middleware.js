import { ApiError } from "../Utils/Api.Error.js";
import { asyncHandler } from "../Utils/asyncHandler.js"
import jwt from "jsonwebtoken";
import { User } from "../Models/user.models.js";

export const isAuthenticated = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new ApiError(401, "Please login to access this resource");
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decodedData.id);

    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Token Access");
  }
});


export const authorizeRoles = (...roles) => asyncHandler(async (req, res, next) => {
  try {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(
        403,
        `Role: ${req.user ? req.user.role : 'Unknown'} is not allowed to access this resource`
      );
    }
    next();
  } catch (error) {
    throw new ApiError(403, error?.message || "Unauthorized Access");
  }
});