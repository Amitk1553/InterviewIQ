import { GoogleGenAI } from "@google/genai";
import { response } from "express";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .min(0)
    .max(100)
    .describe(
      "The match score between the candidate's profile and the job description, on a scale of 0 to 100.",
    ),
  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question can be asked in the interview."),
        intention: z
          .string()
          .describe(
            "The intention of the interviewer behind asking this question.",
          ),
        expectedAnswer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc.",
          ),
      }),
    )
    .describe(
      "Technical questions that the candidate can expect in the interview based on the job description and the candidate's profile.",
    ),
  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The behavioral question can be asked in the interview."),
        intention: z
          .string()
          .describe("The intention behind asking this question."),
        expectedAnswer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc.",
          ),
      }),
    )
    .describe(
      "Behavioral questions that the candidate can expect in the interview based on the job description and the candidate's profile.",
    ),
  skillGaps: z
    .array(
      z.object({
        skill: z
          .string()
          .describe("The skill in which the candidate is lacking."),
        severity: z
          .enum(["low", "medium", "high"])
          .describe("The severity of the skill gap."),
      }),
    )
    .describe("Gaps in the candidate's skills that need to be addressed."),
  preparationPlan: z
    .array(
      z.object({
        day: z.number().describe("The day number in the preparation plan."),
        tasks: z
          .string()
          .describe(
            "The specific topics or tasks the candidate should study on this day.",
          ),
      }),
    )
    .describe("The preparation plan for the interview."),
});

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `Generate an interview preparation report based on the following information:
    Resume: ${resume}
    Self Description: ${selfDescription}
    Job Description: ${jobDescription}`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: zodToJsonSchema(interviewReportSchema),
    },
  });

  console.log(response.text);
}

export { generateInterviewReport };
