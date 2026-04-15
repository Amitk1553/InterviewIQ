import mongoose from "mongoose";
import { type } from "os";

/**
 * what we want from users:
 * - job description schema: String
 * - resume text : string
 * - self description of the candidate : string
 * -matchScore : number 0-100
 *
 * what ai will generate:
 * -Technical questions:
 *     [{
 *       question: "",
 *        intention: "",
 *        answer: "",
 *     }]
 * - Behavioral questions:
 *      [{
 *       question: "",
 *        intention: "",
 *        answer: "",
 *     }]
 * - Skill gaps :
 *              [{
 *               skill: "",
 *               severity: {
 *               type: Sring,
 *           enum: ["low", "medium", "high"]
 * }
 * }]
 * - Preparation plan : [{
 *               day : number,
 *               focus: string,
 *               tasks: [string]
 *               }]
 */

const technicalQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Technical question is required"],
    },
    intention: {
      type: String,
      required: [true, "Intention is required"],
    },
    answer: {
      type: String,
      required: [true, "Answer is required"],
    },
  },
  {
    _id: false,
  },
);

const behavioralQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Behavioral question is required"],
    },
    intention: {
      type: String,
      required: [true, "Intention is required"],
    },
    answer: {
      type: String,
      required: [true, "Answer is required"],
    },
  },
  {
    _id: false,
  },
);

const skillGapSchema = new mongoose.Schema(
  {
    skill: {
      type: String,
      required: [true, "Skill is required"],
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      required: [true, "Severity is required"],
    },
  },
  {
    _id: false,
  },
);

const preparationPlanSchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: [true, "Day is required"],
    },
    focus: {
      type: String,
      required: [true, "Focus is required"],
    },
    tasks: {
      type: [String],
      required: [true, "Tasks are required"],
    },
  },
  {
    _id: false,
  },
);

const interviewReportSchema = new mongoose.Schema(
  {
    jobDescription: {
      type: String,
      required: [true, "Job description is required"],
    },
    resume: {
      type: String,
    },
    selfDescription: {
      type: String,
    },
    matchScore: {
      type: Number,
      min: [0, "Match score cannot be less than 0"],
      max: [100, "Match score cannot be greater than 100"],
    },
    technicalQuestions: [technicalQuestionSchema],
    behavioralQuestions: [behavioralQuestionSchema],
    skillGaps: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    title: {
      type: String,
      required: [true, "Job title is required"],
    },
  },
  {
    timestamps: true,
  },
);

const InterviewReportModel = mongoose.model(
  "InterviewReport",
  interviewReportSchema,
);
console.log("InterviewReportModel", InterviewReportModel);
export default InterviewReportModel;
