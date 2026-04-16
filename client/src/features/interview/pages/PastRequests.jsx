import React from "react";
import { useNavigate } from "react-router";
import { useInterview } from "../hooks/useInterview.js";
import "../style/past-requests.scss";

const PastRequests = () => {
  const { loading, reports } = useInterview();
  const navigate = useNavigate();

  if (loading) {
    return (
      <main className="loading-screen">
        <h1>Loading your interview plans...</h1>
      </main>
    );
  }

  return (
    <div className="past-requests-page">
      {/* Page Header */}
      <header className="page-header">
        <h1>
          My <span className="highlight">Interview Plans</span>
        </h1>
        <p>
          Review all your previously generated interview strategies and match
          scores.
        </p>
      </header>

      {/* Reports Section */}
      {reports && reports.length > 0 ? (
        <section className="recent-reports">
          <h2>Your Interview Plans ({reports.length})</h2>
          <ul className="reports-list">
            {reports.map((report) => (
              <li
                key={report._id}
                className="report-item"
                onClick={() => navigate(`/interview/${report._id}`)}
              >
                <div className="report-content">
                  <h3>{report.title || "Untitled Position"}</h3>
                  <p className="report-meta">
                    Generated on{" "}
                    {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                  <p
                    className={`match-score ${report.matchScore >= 80 ? "score--high" : report.matchScore >= 60 ? "score--mid" : "score--low"}`}
                  >
                    Match Score: {report.matchScore}%
                  </p>
                </div>
                <div className="report-action">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section className="empty-state">
          <div className="empty-state__content">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
              <polyline points="13 2 13 9 20 9"></polyline>
            </svg>
            <h2>No Interview Plans Yet</h2>
            <p>
              Create your first interview plan to get started with personalized
              strategies.
            </p>
            <button className="create-btn" onClick={() => navigate("/")}>
              Create Your First Plan
            </button>
          </div>
        </section>
      )}

      {/* Page Footer */}
      <footer className="page-footer">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
        <a href="#">Help Center</a>
      </footer>
    </div>
  );
};

export default PastRequests;
