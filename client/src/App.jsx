import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import JobListing from "./components/JobListing";
import JobSeeker from "./components/JobSeeker";
import AddJob from "./components/AddJob";
import Admin from "./components/Admin";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={<div className="p-4">Welcome to the Home Page</div>}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/jobs" element={<JobListing />} />
        <Route path="/jobseeker" element={<JobSeeker />} />
        <Route path="/add-job" element={<AddJob />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
