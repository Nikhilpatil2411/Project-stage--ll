import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./components/UserDashboard";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Upload from "./pages/Upload";
import Skills from "./pages/Skills";
import ExpertDashboard from "./components/ExpertDashboard";
import ApplicantDetails from "./pages/ApplicantDetails";
import ApplicantsList from "./pages/ApplicantsList";
import "./index.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/expert-dashboard" element={<ExpertDashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/upload" element={<Upload />} />

        {/* Applicants list for a specific job */}
        <Route path="/jobs/:jobId/applicants" element={<ApplicantsList />} />

        {/* Single applicant details */}
        <Route path="/applicant/:applicationId" element={<ApplicantDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
                          