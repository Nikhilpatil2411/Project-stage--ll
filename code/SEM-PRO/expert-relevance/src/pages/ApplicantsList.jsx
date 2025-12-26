// src/pages/ApplicantsList.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Grid, Paper, Button, Chip } from "@mui/material";
import Header from "../components/Header";

function ApplicantsList() {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/applications/job/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch applications");
        const data = await res.json();
        setApplications(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [jobId, token]);

  if (loading) return <Typography sx={{ mt: 10, textAlign: "center" }}>Loading applicants...</Typography>;
  if (error) return <Typography sx={{ mt: 10, color: "red", textAlign: "center" }}>{error}</Typography>;
  if (!applications.length) return <Typography sx={{ mt: 10, textAlign: "center" }}>No applicants yet.</Typography>;

  return (
    <>
      <Header />
      <Box sx={{ mt: 10, px: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#DB8C3F", mb: 3 }}>
          Applicants
        </Typography>

        <Grid container spacing={3}>
          {applications.map((app) => (
            <Grid item xs={12} sm={6} md={4} key={app._id}>
              <Paper
                elevation={6}
                sx={{
                  p: 3,
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, #fdfbfb, #e0f7fa)",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "scale(1.03)" },
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#00796b" }}>
                  {app.candidateId?.name || app.candidateName}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {app.candidateId?.email || app.candidateEmail}
                </Typography>

                <Box sx={{ mb: 1 }}>
                  {app.candidateId?.skills?.length > 0
                    ? app.candidateId.skills.map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          size="small"
                          sx={{ mr: 0.5, mb: 0.5, backgroundColor: "#b2dfdb", color: "#004d40" }}
                        />
                      ))
                    : "No skills listed"}
                </Box>

                <Button
                  variant="contained"
                  sx={{ mt: 2, backgroundColor: "#00796b", "&:hover": { backgroundColor: "#004d40" }, borderRadius: "8px" }}
                  onClick={() => navigate(`/applicant/${app._id}`)}
                >
                  View Details
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}

export default ApplicantsList;
