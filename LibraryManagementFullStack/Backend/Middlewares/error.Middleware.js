class ApiError extends Error{
  constructor(message,statusCode){
      super(message);
      this.statusCode=statusCode;
  }
}
export const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal server error.";
  err.statusCode = err.statusCode || 500;
  // MongoDB duplicate key error
  if (err.code === 11000) {
    const message = "Duplicate value entered.";
    err = new ApiError(message, 400);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    err = new ApiError("Invalid token. Please try again.", 401);
  }
  if (err.name === "TokenExpiredError") {
    err = new ApiError("Token expired. Please login again.", 401);
  }
  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = `Invalid ${err.path}`;
    err = new ApiError(message, 400);
  }
  // Mongoose validation errors
  const errorMessage = err.errors
    ? Object.values(err.errors).map((e) => e.message).join(" ")
    : err.message;

  return res.status(err.statusCode).json({
    success: false,
    message: errorMessage,
  });
};
export default ApiError;
