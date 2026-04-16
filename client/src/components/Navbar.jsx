import React from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../features/auth/hooks/useAuth.js";
import { useTheme } from "../context/ThemeContext.jsx";
import { FaSun, FaMoon } from "react-icons/fa";
import "./navbar.scss";

const Navbar = () => {
  const { user, handleLogout, loading } = useAuth();
  const { currentTheme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    await handleLogout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          InterviewIQ
        </Link>

        <ul className="nav-menu">
          {loading ? (
            <li className="nav-item">
              <span>Loading...</span>
            </li>
          ) : user ? (
            <>
              <li className="nav-item">
                <Link to="/" className="nav-link">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/past-requests" className="nav-link">
                  Past Requests
                </Link>
              </li>
              <li className="nav-item">
                <button
                  onClick={handleLogoutClick}
                  className="nav-link logout-btn"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link">
                  Register
                </Link>
              </li>
            </>
          )}
          <li className="nav-item">
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title={`Switch to ${currentTheme === "dark" ? "Cream" : "Dark"} theme`}
            >
              {currentTheme === "dark" ? <FaSun /> : <FaMoon />}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
