import JWT from "jsonwebtoken";
import CustomError from "../services/CustomError.js";
import asyncHandler from "../services/asyncHandler.js";
import config from "../config/index.js";
import User from "../models/user.model.js";

export const isLoggedIn = asyncHandler(async (req, _res, next) => {
  let token;

  // Check for token in cookies or Authorization header
  if (req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new CustomError("Please login to access this resource", 401);
  }

  try {
    // Verify token
    const decodedToken = JWT.verify(token, config.JWT_SECRET);

    // Check if token is expired
    if (decodedToken.exp && Date.now() >= decodedToken.exp * 1000) {
      throw new CustomError("Token has expired, please login again", 401);
    }

    // Fetch user (excluding password) and check if exists
    const user = await User.findById(decodedToken._id).select("-password");
    
    if (!user) {
      throw new CustomError("User not found", 401);
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === "JsonWebTokenError") {
      throw new CustomError("Invalid token", 401);
    }
    if (error.name === "TokenExpiredError") {
      throw new CustomError("Token has expired", 401);
    }
    
    // If it's already a CustomError, throw it as is
    if (error instanceof CustomError) {
      throw error;
    }

    // For any other errors
    throw new CustomError("Authentication failed", 401);
  }
});
