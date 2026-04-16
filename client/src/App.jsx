import { RouterProvider } from "react-router";
import { router } from "./app.routes.jsx";
import { AuthProvider } from "./features/auth/auth.context.jsx";
import { InterviewProvider } from "./features/interview/interview.context.jsx";
import { ThemeProvider, useTheme } from "./context/ThemeContext.jsx";

/**
 * AppContent - Internal component that consumes theme and applies it
 * This is necessary because useTheme hook must be inside ThemeProvider
 */
function AppContent() {
  const { currentTheme } = useTheme();

  return (
    <div className={`app-${currentTheme}`}>
      <AuthProvider>
        <InterviewProvider>
          <RouterProvider router={router} />
        </InterviewProvider>
      </AuthProvider>
    </div>
  );
}

/**
 * App - Root component wraps application with ThemeProvider
 */
function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
