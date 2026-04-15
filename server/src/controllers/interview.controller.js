import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");
import {
  generateInterviewReport,
  generateResumePdf,
} from "../services/ai.service.js";
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
    console.log("Resume content:", resumeContent.text);
    console.log("Self description:", selfDescription);
    console.log("Job description:", jobDescription);
    const interviewReportByAi = await generateInterviewReport({
      resume: resumeContent.text,
      selfDescription,
      jobDescription,
    });

    // Attempt to parse the AI output if it comes back as strings
    let parsedAiData = { ...interviewReportByAi };
    
    try {
      if (typeof parsedAiData.technicalQuestions === 'string') parsedAiData.technicalQuestions = JSON.parse(parsedAiData.technicalQuestions);
      if (typeof parsedAiData.behavioralQuestions === 'string') parsedAiData.behavioralQuestions = JSON.parse(parsedAiData.behavioralQuestions);
      if (typeof parsedAiData.skillGaps === 'string') parsedAiData.skillGaps = JSON.parse(parsedAiData.skillGaps);
      if (typeof parsedAiData.preparationPlan === 'string') parsedAiData.preparationPlan = JSON.parse(parsedAiData.preparationPlan);
    } catch (parseError) {
      console.error("Failed to parse AI JSON. Ensure the AI is returning strict JSON.", parseError);
      return res.status(500).json({ message: "AI returned invalid data format." });
    }

    const interviewReport = await InterviewReportModel.create({
      user: req.user.id,
      resume: resumeContent.text,
      selfDescription,
      jobDescription,
      ...parsedAiData, // Use the parsed data here
    });
    console.log("interviewReportByAi",interviewReportByAi);
    console.log("interviewReportBy",interviewReport);

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
    const interviewReports = await InterviewReportModel.find({
      user: req.user.id,
    })
      .sort({ createdAt: -1 })
      .select(
        "-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan",
      );
      console.log("Fetched interview reports:", interviewReports);
      console.log(req.user.id);
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

/**
 * @desc controller to Generate resume pdf on the basis of user self description and job description.
 */
async function generateResumePdfController(req, res) {
  const { interviewReportId } = req.params;

  const interviewReport =
    await InterviewReportModel.findById(interviewReportId);
  if (!interviewReport) {
    return res.status(404).json({ message: "Interview report not found" });
  }

  const { resume, jobDescription, selfDescription } = interviewReport;

  const pdfBuffer = await generateResumePdf({
    resume,
    jobDescription,
    selfDescription,
  });

  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`,
  });
  res.send(pdfBuffer);
}

export default {
  generateInterviewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  generateResumePdfController,
};
