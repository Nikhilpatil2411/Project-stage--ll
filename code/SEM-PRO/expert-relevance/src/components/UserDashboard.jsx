import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Paper, Button, CircularProgress } from "@mui/material";
import Layout from "./Layout";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load user info
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser || null);
  }, []);

  // Fetch all jobs for available jobs section
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/jobs");
        const data = await res.json();
        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    fetchJobs();
  }, []);

  // Fetch applied jobs (full job details)
  useEffect(() => {
    const fetchAppliedJobs = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:5000/api/applications/my-applications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        // Extract job details from populated jobId
        const jobsData = data.map((app) => app.jobId);
        setAppliedJobs(jobsData);
      } catch (err) {
        console.error("Error fetching applied jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, []);

  const handleApply = async (jobId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to apply.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/applications/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ jobId }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Applied successfully!");
        // Add to appliedJobs (get job details from jobs array)
        const appliedJob = jobs.find((job) => job._id === jobId);
        if (appliedJob) {
          setAppliedJobs([...appliedJobs, appliedJob]);
        }
      } else {
        alert(data.message || "Failed to apply");
      }
    } catch (err) {
      console.error(err);
      alert("Error applying for job");
    }
  };

  if (!user) return <Typography sx={{ mt: 12, ml: 4 }}>Loading...</Typography>;

  // Filter available jobs (exclude already applied ones)
  const availableJobs = jobs.filter((job) => !appliedJobs.some((aj) => aj._id === job._id));

  return (
    <Layout>
      <Box sx={{ p: 3, minHeight: "100vh", bgcolor: "#f9fafb" }}>
        <Grid container spacing={3}>
          {/* Sidebar */}
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, borderRadius: 3, height: "85vh" }}>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              <Typography><b>Name:</b> {user.name}</Typography>
              <Typography><b>Email:</b> {user.email}</Typography>
              <Typography><b>Phone:</b> {user.phone}</Typography>
            </Paper>
          </Grid>

          {/* Jobs Section */}
          <Grid item xs={12} md={9}>
            {/* Available Jobs */}
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, color: "#DB8C3F" }}>
              Available Jobs
            </Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              {availableJobs.length === 0 && (
                <Typography>No available jobs.</Typography>
              )}
              {availableJobs.map((job) => (
                <Grid item xs={12} md={6} lg={4} key={job._id}>
                  <Paper sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="h6">{job.title}</Typography>
                    <Typography variant="body2">{job.description}</Typography>
                    <Typography><b>Pay:</b> {job.pay}</Typography>
                    <Typography><b>Level:</b> {job.level}</Typography>
                    <Button variant="contained" sx={{ mt: 2 }} onClick={() => handleApply(job._id)}>
                      Apply
                    </Button>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {/* Applied Jobs */}
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, color: "#DB8C3F" }}>
              My Applied Jobs
            </Typography>
            {loading ? (
              <CircularProgress sx={{ mt: 2 }} />
            ) : (
              <Grid container spacing={2}>
                {appliedJobs.length === 0 && (
                  <Typography>No jobs applied yet.</Typography>
                )}
                {appliedJobs.map((job) => (
                  <Grid item xs={12} md={6} lg={4} key={job._id}>
                    <Paper sx={{ p: 3, borderRadius: 2, backgroundColor: "#e0f7ff" }}>
                      <Typography variant="h6">{job.title}</Typography>
                      <Typography variant="body2">{job.description}</Typography>
                      <Typography><b>Pay:</b> {job.pay}</Typography>
                      <Typography><b>Level:</b> {job.level}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default UserDashboard;
