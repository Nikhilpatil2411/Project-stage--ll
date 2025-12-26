// src/components/ExpertDashboard.jsx
import React, { useState, useEffect } from "react";
import { Box, Typography, Button, TextField, Paper, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import axios from "axios";

const ExpertDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [newJob, setNewJob] = useState({ title: "", description: "", requirements: "", pay: "", level: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("jobs");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // ------------------ Fetch jobs once on mount ------------------
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/jobs/my-jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(res.data);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      }
    };
    fetchJobs();
  }, [token]);

  // ------------------ Fetch contacts when 'contacts' section is active ------------------
  useEffect(() => {
    const fetchContacts = async () => {
      if (activeSection !== "contacts") return; // only fetch when needed
      try {
        const res = await axios.get("http://localhost:5000/api/contact/my-contacts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setContacts(res.data);
      } catch (err) {
        console.error("Failed to fetch contacts:", err);
      }
    };
    fetchContacts();
  }, [activeSection, token]);

  // ------------------ Handle input changes ------------------
  const handleChange = (e) => setNewJob({ ...newJob, [e.target.name]: e.target.value });

  // ------------------ Add new job ------------------
  const handleAddJob = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/api/jobs", newJob, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs([...jobs, { ...res.data.job, applicantCount: 0 }]);
      setNewJob({ title: "", description: "", requirements: "", pay: "", level: "" });
      setActiveSection("jobs");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // ------------------ Delete job ------------------
  const handleDeleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(jobs.filter((job) => job._id !== id));
    } catch (err) {
      console.error("Failed to delete job:", err);
    }
  };

  // ------------------ Render UI ------------------
  return (
    <>
      <Header />
      <Box sx={{ p: 3, minHeight: "100vh", bgcolor: "#f9fafb", mt: 8 }}>
        <Grid container spacing={3} alignItems="stretch">
          {/* Sidebar */}
          <Grid item xs={12} md={2}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                height: "85vh",
                position: "sticky", // ✅ fixed overlap issue
                top: "80px",        // keeps it below header
              }}
            >
              <Typography variant="h6" gutterBottom>Expert Actions</Typography>
              <Button
                fullWidth
                variant={activeSection === "add" ? "contained" : "outlined"}
                sx={{ my: 1 }}
                onClick={() => setActiveSection("add")}
              >
                Add New Job
              </Button>
              <Button
                fullWidth
                variant={activeSection === "jobs" ? "contained" : "outlined"}
                sx={{ my: 1 }}
                onClick={() => setActiveSection("jobs")}
              >
                My Posted Jobs
              </Button>
              <Button
                fullWidth
                variant={activeSection === "contacts" ? "contained" : "outlined"}
                sx={{ my: 1 }}
                onClick={() => setActiveSection("contacts")}
              >
                Contacts / Queries
              </Button>
            </Paper>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={10}>
            {/* Add Job Form */}
            {activeSection === "add" && (
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  mb: 4,
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, #fff7f0, #ffffff)",
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>Post a New Job</Typography>
                {error && <Typography color="error">{error}</Typography>}
                {loading && <Typography>Loading...</Typography>}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Title" name="title" value={newJob.title} onChange={handleChange} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Requirements" name="requirements" value={newJob.requirements} onChange={handleChange} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Description" name="description" value={newJob.description} onChange={handleChange} multiline rows={3} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Pay" name="pay" value={newJob.pay} onChange={handleChange} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Level" name="level" value={newJob.level} onChange={handleChange} />
                  </Grid>
                </Grid>
                <Button
                  variant="contained"
                  sx={{
                    mt: 3,
                    backgroundColor: "#DB8C3F",
                    "&:hover": { backgroundColor: "#b36b2f" },
                    borderRadius: "10px",
                    px: 4,
                  }}
                  onClick={handleAddJob}
                >
                  Add Job
                </Button>
              </Paper>
            )}

            {/* Job List */}
            {activeSection === "jobs" && (
              <>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>
                  My Posted Jobs
                </Typography>
                <Grid container spacing={3}>
                  {jobs.length === 0 && <Typography>No jobs posted yet.</Typography>}
                  {jobs.map((job) => (
                    <Grid item xs={12} sm={6} md={4} key={job._id}>
                      <Paper
                        elevation={4}
                        sx={{
                          p: 3,
                          borderRadius: "16px",
                          background: "linear-gradient(135deg, #fdfbfb, #ebedee)",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#DB8C3F" }}>{job.title}</Typography>
                          <Typography sx={{ my: 1 }}>{job.description}</Typography>
                          <Typography variant="body2" color="text.secondary">Requirements: {job.requirements}</Typography>
                          <Typography variant="body2" sx={{ mt: 1 }}>Pay: {job.pay}</Typography>
                          <Typography variant="body2">Level: {job.level}</Typography>
                          <Typography variant="body2" sx={{ mt: 1, fontWeight: "bold" }}>Applicants: {job.applicantCount}</Typography>
                        </Box>
                        <Box>
                          <Button
                            variant="outlined"
                            color="error"
                            sx={{ mt: 2, borderRadius: "8px", textTransform: "none" }}
                            onClick={() => handleDeleteJob(job._id)}
                          >
                            Delete
                          </Button>
                          <Button
                            variant="contained"
                            sx={{
                              mt: 2,
                              ml: 1,
                              backgroundColor: "#2e7d32",
                              "&:hover": { backgroundColor: "#1b5e20" },
                              borderRadius: "8px",
                              textTransform: "none",
                            }}
                            onClick={() => navigate(`/jobs/${job._id}/applicants`)}
                          >
                            Review Applications
                          </Button>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}

            {/* Contacts Section */}
            {activeSection === "contacts" && (
              <>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ fontWeight: "bold", color: "#333" }}
                >
                  Contacts / Queries
                </Typography>
                <Grid container spacing={2}>
                  {contacts.length === 0 && <Typography>No contacts yet.</Typography>}
                  {contacts.map((contact) => (
                    <Grid item xs={12} sm={6} md={4} key={contact._id}>
                      <Paper
                        elevation={2}
                        sx={{
                          p: 2, // smaller padding
                          borderRadius: "12px",
                          background: "#fdfbfb",
                          maxHeight: "180px", // smaller card height
                          overflowY: "auto", // scroll inside if text is long
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: "bold" }}
                        >
                          {contact.name} ({contact.email})
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {contact.message}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ mt: 1, display: "block", color: "gray" }}
                        >
                          {new Date(contact.createdAt).toLocaleString()}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default ExpertDashboard;
