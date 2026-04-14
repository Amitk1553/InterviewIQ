import { GoogleGenAI } from "@google/genai";
import { response } from "express";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import puppeteer from "puppeteer";

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
        answer: z
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
        answer: z
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
        focus: z
          .string()
          .describe("The main focus or topic for this day of preparation."),
        tasks: z
          .array(z.string())
          .describe(
            "The specific topics or tasks the candidate should study on this day.",
          ),
      }),
    )
    .describe("The preparation plan for the interview."),
  title: z
    .string()
    .describe(
      "The title of the interview report, e.g. 'Senior Frontend Engineer at Google - Interview Preparation Report'",
    ),
});

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  // FIX: Updated the prompt to ask for the report, not an HTML resume!
  const prompt = `Generate an interview preparation report based on the following information:
    Resume: ${resume}
    Self Description: ${selfDescription}
    Job Description: ${jobDescription}
    
    CRITICAL: You MUST include ALL of the following in your response:
    1. A professional title (e.g., "Senior Frontend Engineer at Google - Interview Preparation Report")
    2. Match score between 0-100
    3. Technical questions array with question, intention, and answer fields
    4. Behavioral questions array with question, intention, and answer fields
    5. Skill gaps array with skill and severity (low/medium/high) fields
    6. Preparation plan with day, focus, and tasks (array of strings) fields
    
    For the preparation plan example:
    {
      "day": 1,
      "focus": "Core Concepts & Data Structures",
      "tasks": ["Review arrays and strings", "Practice sorting algorithms", "Study hash maps"]
    }
    
    Analyze the candidate's profile comprehensively against the job description and provide all required fields above. Ensure the output is valid JSON that follows the schema exactly.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: zodToJsonSchema(interviewReportSchema),
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Generation Error in generateInterviewReport:", error);
    throw new Error("Failed to generate report from AI");
  }
}

async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });
  const pdfBuffer = await page.pdf({
    format: "A4",
    margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" },
  });
  await browser.close();
  return pdfBuffer;
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
  const resumePdfSchema = z.object({
    html: z
      .string()
      .describe(
        "The HTML content of the resume which can be converted to PDF using any library like puppeteer.",
      ),
  });

  const prompt = `Generate a resume for a candidate with the following information:
    Resume: ${resume}
    Self Description: ${selfDescription}
    Job Description: ${jobDescription}
 the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity
`;
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(resumePdfSchema),
    },
  });

  const jsonContent = JSON.parse(response.text);

  const pdfBuffer = await generatePdfFromHtml(jsonContent.html);

  return pdfBuffer;
}

export { generateInterviewReport, generateResumePdf };
