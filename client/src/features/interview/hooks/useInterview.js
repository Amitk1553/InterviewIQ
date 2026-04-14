import { getAllInterviewReports, generateInterviewReport, getInterviewReportById } from "../services/interview.api.js";
import { useContext, useEffect } from "react";
import { InterviewContext } from "../interview.context.jsx";
import { useParams } from "react-router";


export const useInterview = () => {
    const context = useContext(InterviewContext);
    const { interviewId } = useParams()
    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider");
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context;

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true);
        let response = null
        try {
            const response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile });
            setReport(response.interviewReport);
        } catch (error) {
            console.error("Error generating interview report:", error);
            throw error;
        } finally {
            setLoading(false);
        }

        return response.interviewReport
    }

    const getReportById = async (interviewId) => {
        setLoading(true);
        let response = null
        try {
            const response = await getInterviewReportById(interviewId);
            setReport(response.interviewReport);
        } catch (error) {
            console.error("Error fetching interview report:", error);
            throw error;
        } finally {
            setLoading(false);
        }
        return response.interviewReport
    };

    const getReports = async () => {
        setLoading(true);
        let response = null
        try {
            const response = await getAllInterviewReports();
            setReports(response.interviewReports);
        } catch (error) {
            console.error("Error fetching interview reports:", error);
            throw error;
        } finally {
            setLoading(false);
        }
        return response.interviewReports
    };

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
        }
    }, [interviewId]);

    return { loading, report, reports, generateReport, getReportById, getReports };
}