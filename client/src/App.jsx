import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import JobListing from "./components/JobListing";
import JobSeeker from "./components/JobSeeker";
import AddJob from "./components/AddJob";
import Admin from "./components/Admin";
import AdminRegister from "./components/AdminRegister";
import Navbar from "./components/Navbar";
import { isAuthenticated, getUserRole } from "./utils/auth";
import "./App.css";

const AuthRoute = ({ children }) => {
  if (isAuthenticated()) {
    const userRole = getUserRole();
    // Redirect to role-specific page
    switch (userRole) {
      case "worker":
        return <Navigate to="/jobseeker" replace />;
      case "client":
        return <Navigate to="/jobs" replace />;
      case "admin":
        return <Navigate to="/admin" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }
  return children;
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  const userRole = getUserRole();
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect to role-specific page
    switch (userRole) {
      case "worker":
        return <Navigate to="/jobseeker" replace />;
      case "client":
        return <Navigate to="/jobs" replace />;
      case "admin":
        return <Navigate to="/admin" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthRoute>
              <Signup />
            </AuthRoute>
          }
        />
        <Route
          path="/admin/register"
          element={
            <AuthRoute>
              <AdminRegister />
            </AuthRoute>
          }
        />
        <Route
          path="/jobs"
          element={
            <ProtectedRoute allowedRoles={["client"]}>
              <JobListing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobseeker"
          element={
            <ProtectedRoute allowedRoles={["worker"]}>
              <JobSeeker />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-job"
          element={
            <ProtectedRoute allowedRoles={["client"]}>
              <AddJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Admin />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
