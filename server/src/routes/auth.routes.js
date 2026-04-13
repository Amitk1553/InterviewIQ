import { Router } from "express";
import {
  registerUserController,
  loginUserController,
  logoutUserController,
  getMeController,
} from "../controllers/auth.controller.js";
import authUser from "../middlewares/auth.middleware.js";
const authRouter = Router();

/**
 * @route POST /api/auth/login
 * @desc Login user and return JWT token
 * @access Public
 */
authRouter.post("/register", registerUserController);

/**
 * @route POST /api/auth/login
 * @desc login user with email and password, return JWT token
 * @access Public
 */
authRouter.post("/login", loginUserController);

/**
 * @route GET /api/auth/logout
 * @desc Logout user by blacklisting the token, clear the cookie
 * @access Public
 */
authRouter.get("/logout", logoutUserController);

/**
 * @route GET /api/auth/get-me
 * @desc Get the logged in user's details, expecting the token in the cookie
 * @access Private
 */
authRouter.get("/get-me", authUser, getMeController);

export default authRouter;
