import User from "../models/user.model.js";
import asyncHandler from "../services/asyncHandler";
import CustomError from "../services/CustomError";

export const cookieOptions = {
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  httpOnly: true,
};

/******************************************************
 * @SIGNUP
 * @route <URL>/api/v1/auth/signup
 * @description User signUp Controller for creating new user
 * @returns User Object
 ******************************************************/
export const signUp = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  // validation
  if (!name || !email || !password) {
    throw new CustomError("Please fill all Credentials", 400);
  }

  // Adding this user's Credentials data to database

  // But first check if user already exists?
  const exitingUser = await User.findOne({ email });
  if (exitingUser) {
    throw new CustomError("User already exists", 400);
  }
  // Now add data
  const user = await User.create({
    name,
    email,
    password,
  });

  // Generate Token of user
  const token = user.getJWTToken();

  // Store this token in user's cookie
  res.cookie("token", token, cookieOptions);

  console.log("Cookies: ", req.cookies);
  // Sending token to client in response
  res.status(200).json({
    success: true,
    message: "Your Account created successfully",
    // token,
  });
});

/*********************************************************
 * @LOGIN
 * @route <URL>/api/v1/auth/login
 * @description User Login Controller for signing in the user
 * @returns User Object
 *********************************************************/
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // Validation
  if (!email || !password) {
    throw new CustomError("Please fill all details", 400);
  }
  console.log("login");
  const user = await User.findOne({ email }).select("+password");
  console.log(user);

  if (!user) {
    throw new CustomError("Invalid creadentials", 400);
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (isPasswordMatched) {
    const token = user.getJWTToken();

    res.cookie("token", token, cookieOptions);
    console.log("Cookies: ", req.cookies);

    return res.status(200).json({
      success: true,
      message: "You Logged in successfully",
      // token,
    });
  }
  throw new CustomError("Password is incorrect", 400);
});

/**********************************************************
 * @LOGOUT
 * @route <URL>/api/v1/auth/logout
 * @description User Logout Controller for logging out the user
 * @description Removes token from cookies
 * @returns Success Message with "Logged Out"
 **********************************************************/
export const logout = asyncHandler(async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  console.log("Cookies_after_logout: ", req.cookies);

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

/**********************************************************
 * @GET_PROFILE
 * @route <URL>/api/v1/auth/profile
 * @description check token in cookies, if present then returns user details
 * @returns Logged In User Details
 **********************************************************/
export const getProfile = asyncHandler(async (req, res) => {
  const { user } = req;
  if (!user) {
    throw new CustomError("User Not Found", 401);
  }
  res.status(200).json({
    success: true,
    user,
  });
});


/**********************************************************
 * @checkTokenValidity
 * @route <URL>/api/v1/auth/checkTokenValidity
 * @description check token in cookies, then return flag
 * @returns Logged In User validity
 **********************************************************/
export const checkTokenValidity = asyncHandler(async (req, res) => {
  try {
    const user = req.user; // User object obtained from the middleware
    res.status(200).json({
      isAuthenticated: !!user, // Convert to boolean
    });
  } catch (error) {
    console.error("Error checking token validity:", error);
    res.status(500).json({
      isAuthenticated: false,
    });
  }
});
