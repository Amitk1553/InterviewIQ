import UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import tokenBlacklistModel from "../models/blacklist.model.js";

/**
 * @name registerUserController
 * @desc register a new user, expecting username, email and password in the request body
 * @access Public
 */

async function registerUserController(req, res) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const isUserAlreadyExists = await UserModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserAlreadyExists) {
    return res
      .status(400)
      .json({ message: "Username or email already exists" });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await UserModel.create({
    username,
    email,
    password: hash,
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("token", token, {
    httpOnly: true, // Prevents JavaScript from reading the cookie
    secure: true, // REQUIRED for cross-site cookies (forces HTTPS)
    sameSite: "none", // REQUIRED for cross-site cookies (allows Vercel -> Render)
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

/**
 * @name loginUserController
 * @desc login a user, expecting email and password in the request body
 * @access Public
 */
async function loginUserController(req, res) {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("token", token, {
    httpOnly: true, // Prevents JavaScript from reading the cookie
    secure: true, // REQUIRED for cross-site cookies (forces HTTPS)
    sameSite: "none", // REQUIRED for cross-site cookies (allows Vercel -> Render)
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  res.status(200).json({
    message: "User logged in successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

/**
 * @name logoutUserController
 * @desc logout a user by blacklisting the token and clearing the cookie
 * @access Public
 */
async function logoutUserController(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }

  await tokenBlacklistModel.create({ token });

  res.clearCookie("token");

  res.status(200).json({ message: "User logged out successfully" });
}

/**
 * @name getMeController
 * @desc get the logged in user's details.
 * @access Private
 */
async function getMeController(req, res) {
  const user = await UserModel.findById(req.user.id);

  res.status(200).json({
    message: "User details fetched successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

export {
  registerUserController,
  loginUserController,
  logoutUserController,
  getMeController,
};
