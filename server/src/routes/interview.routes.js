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

/**
 * @route GET /api/interview/report/:interviewId
 * @desc Get interview report by interviewId.
 * @access Private
 */
interviewRouter.get("/report/:interviewId", authMiddleware, interviewController.getInterviewReportByIdController);

/**
 * @route GET /api/interview/
 * @desc Get all interview reports of the logged in user.
 * @access Private
 */
interviewRouter.get("/", authMiddleware, interviewController.getAllInterviewReportsController);

/**
 * @route GET /api/interview/resume/pdf/:interviewReportId
 * @desc Generate resume pdf on the basis of user self description and job description.
 * @access Private
 */
interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware, interviewController.generateResumePdfController);
 

export default interviewRouter;
