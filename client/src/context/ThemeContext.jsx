import React, { createContext, useState, useContext, useEffect } from "react";

/**
 * ThemeContext - Manages global theme state (dark or cream)
 * Provides access to current theme and toggle function to all child components
 */
const ThemeContext = createContext();

/**
 * ThemeProvider Component
 * Wraps the application and provides theme state to all descendants
 */
export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage or default to 'dark'
  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem("appTheme");
    return savedTheme || "dark";
  });

  // Update localStorage whenever theme changes
  useEffect(() => {
    localStorage.setItem("appTheme", currentTheme);
  }, [currentTheme]);

  /**
   * toggleTheme - Switches between 'dark' and 'cream' themes
   */
  const toggleTheme = () => {
    setCurrentTheme((prevTheme) => (prevTheme === "dark" ? "cream" : "dark"));
  };

  const value = {
    currentTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

/**
 * useTheme - Custom hook to access theme context
 * @returns {Object} - { currentTheme, toggleTheme }
 * @throws {Error} - If used outside ThemeProvider
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
