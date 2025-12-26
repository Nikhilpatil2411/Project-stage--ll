// src/pages/MyPostedJobs.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  TextField,
} from "@mui/material";

const MyPostedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [applications, setApplications] = useState([]);

  // Fetch jobs created by the logged-in user
  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/jobs/my-jobs", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Handle job creation
  const handleAddJob = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ title, description }),
      });
      const data = await res.json();
      setJobs([...jobs, data]); // update state
      setShowForm(false);
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error("Error adding job:", err);
    }
  };

  // Fetch applications for a specific job
  const handleViewApplications = async (jobId) => {
    try {
      setSelectedJobId(jobId);
      const res = await fetch(`/api/applications/${jobId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setApplications(data);
    } catch (err) {
      console.error("Error fetching applications:", err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Posted Jobs
      </Typography>

      {/* Add New Job Button */}
      {!showForm && (
        <Button
          variant="contained"
          sx={{ mb: 3 }}
          onClick={() => setShowForm(true)}
        >
          Add New Job
        </Button>
      )}

      {/* Add Job Form */}
      {showForm && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Add New Job
          </Typography>
          <form onSubmit={handleAddJob}>
            <TextField
              label="Job Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Job Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={4}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button type="submit" variant="contained">
                Save Job
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </Box>
          </form>
        </Paper>
      )}

      {/* Posted Jobs List */}
      <Grid container spacing={2}>
        {jobs.map((job) => (
          <Grid item xs={12} key={job._id}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">{job.title}</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {job.description}
              </Typography>
              <Button
                variant="outlined"
                onClick={() => handleViewApplications(job._id)}
              >
                View Applications
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Applications Section */}
      {selectedJobId && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Applications for Job #{selectedJobId}
          </Typography>

          {applications.length > 0 ? (
            applications.map((app) => (
              <Paper
                key={app._id}
                sx={{ p: 2, mb: 2, background: "#f9f9f9" }}
              >
                <Typography>
                  <b>Name:</b> {app.user?.name}
                </Typography>
                <Typography>
                  <b>Email:</b> {app.user?.email}
                </Typography>
                <Typography>
                  <b>Status:</b> {app.status}
                </Typography>
              </Paper>
            ))
          ) : (
            <Typography>No applications yet.</Typography>
          )}

          <Button
            variant="contained"
            color="secondary"
            sx={{ mt: 2 }}
            onClick={() => setSelectedJobId(null)}
          >
            Close
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default MyPostedJobs;
