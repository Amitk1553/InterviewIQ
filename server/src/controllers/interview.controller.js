import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");
import { generateInterviewReport } from "../services/ai.service.js";
import InterviewReportModel from "../models/interviewReport.model.js";

/**
 * @desc Generate interview report based on user resume, self description and job description.
 */

async function generateInterviewReportController(req, res) {
  try {
    const resumeContent = await new pdfParse.PDFParse(
      Uint8Array.from(req.file.buffer),
    ).getText();
    const { selfDescription, jobDescription } = req.body;

    const interviewReportByAi = await generateInterviewReport({
      resume: resumeContent.text,
      selfDescription,
      jobDescription,
    });
    const interviewReport = await InterviewReportModel.create({
      user: req.user.id,
      resume: resumeContent.text,
      selfDescription,
      jobDescription,
      ...interviewReportByAi,
    });
    res.status(201).json({
      message: "Interview report generated successfully",
      interviewReport: interviewReport,
    });
  } catch (error) {
    console.error("Error generating interview report:", error);
    res.status(500).json({
      message: "Failed to generate interview report",
      error: error.message,
    });
  }
}

/**
 * @desc controller to Get interview report by interviewId.
 */

async function getInterviewReportByIdController(req, res) {
  try {
    const { interviewId } = req.params;

    const interviewReport = await InterviewReportModel.findOne({
      _id: interviewId,
      user: req.user.id,
    });

    if (!interviewReport) {
      return res.status(404).json({ message: "Interview report not found" });
    }
    res.status(200).json({
      message: "Interview report fetched successfully",
      interviewReport: interviewReport,
    });
  } catch (error) {
    console.error("Error fetching interview report:", error);
    res.status(500).json({
      message: "Failed to fetch interview report",
      error: error.message,
    });
  }
}

/**
 * @desc controller to Get all interview reports of the logged in user.
 */

async function getAllInterviewReportsController(req, res) {
  try {
    const interviewReports = (await InterviewReportModel.find({ user: req.user.id })).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");
    res.status(200).json({
      message: "Interview reports fetched successfully",
      interviewReports: interviewReports,
    });
  } catch (error) {
    console.error("Error fetching interview reports:", error);
    res.status(500).json({
      message: "Failed to fetch interview reports",
      error: error.message,
    });
  }
}

export default {
  generateInterviewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
};
