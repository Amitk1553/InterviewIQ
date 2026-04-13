import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import interviewController from "../controllers/interview.controller.js";
import upload from "../middlewares/file.middleware.js";

const interviewRouter = express.Router();

/**
 * @route POST /api/interview/
 * @desc Generate new interview report on the basis of user self description, resume pdf and job description.
 * @access Private
 */

interviewRouter.post("/", authMiddleware, upload.single("resume"), interviewController.generateInterviewReportController);

export default interviewRouter;
