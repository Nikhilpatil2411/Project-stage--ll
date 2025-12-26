// src/pages/ApplicantDetails.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Chip,
  Grid,
  Button,
  TextField,
} from "@mui/material";
import Header from "../components/Header";

function ApplicantDetails() {
  const { applicationId } = useParams();
  const [applicant, setApplicant] = useState(null);
  const [matchResults, setMatchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const token = localStorage.getItem("token");

  // Fetch applicant details
  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/applications/${applicationId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Candidate not found");
        const data = await res.json();
        setApplicant(data);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidate();
  }, [applicationId, token]);

  // Fetch skill match from CSV
  useEffect(() => {
    const fetchSkillMatch = async () => {
      if (!applicant) return;
      const candidateSkills = applicant.candidateId?.skills || [];
      try {
        const res = await fetch("http://localhost:5001/match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ candidate_skills: candidateSkills }),
        });
        const data = await res.json();
        setMatchResults(data);
      } catch (err) {
        console.error("Error fetching skill match:", err);
      }
    };
    fetchSkillMatch();
  }, [applicant]);

  // Schedule Interview using CSV expert email
  const handleScheduleInterview = async (expert) => {
    try {
      const res = await fetch("http://localhost:5000/api/interviews/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          applicationId,
          expertName: expert.expert_name,
          expertEmail: expert.email,
          date,
          time,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Interview scheduled successfully! Emails sent to both.");
      } else {
        alert(`⚠️ Failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Error scheduling interview:", error);
      alert("❌ Error scheduling interview");
    }
  };

  if (loading)
    return (
      <>
        <Header />
        <Typography sx={{ mt: 4, textAlign: "center" }}>Loading...</Typography>
      </>
    );

  if (!applicant)
    return (
      <>
        <Header />
        <Typography sx={{ mt: 4, textAlign: "center" }}>
          Applicant not found
        </Typography>
      </>
    );

  return (
    <>
      <Header />
      <Box sx={{ p: 4, mt: 5 }}>
        <Typography variant="h4" sx={{ mb: 3, color: "#DB8C3F" }}>
          Applicant Details
        </Typography>

        {/* Personal Info */}
        <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: "12px" }}>
          <Typography variant="h6">Personal Info</Typography>
          <Typography>
            <strong>Name:</strong>{" "}
            {applicant.candidateId?.name || applicant.candidateName}
          </Typography>
          <Typography>
            <strong>Email:</strong>{" "}
            {applicant.candidateId?.email || applicant.candidateEmail}
          </Typography>
        </Paper>

        {/* Skills */}
        {/* <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: "12px" }}>
          <Typography variant="h6">Skills</Typography>
          <Grid container spacing={1} sx={{ mt: 1 }}>
            {(applicant.candidateId?.skills || []).map((skill, index) => (
              <Grid item key={index}>
                <Chip label={skill} color="primary" variant="outlined" />
              </Grid>
            ))}
          </Grid>
        </Paper> */}

        {/* Expert Matches */}
        {matchResults.length > 0 && (
          <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: "12px" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Top 5 Expert Matches
            </Typography>
            {matchResults.map((expert, idx) => (
              <Box key={idx} sx={{ mb: 4 }}>
                <Typography variant="subtitle1">
                  {expert.expert_name}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    flexWrap: "wrap",
                  }}
                >
                  <Box sx={{ position: "relative", display: "inline-flex" }}>
                    <CircularProgress
                      variant="determinate"
                      value={expert.match_percentage || 0}
                      size={100}
                      thickness={5}
                      sx={{ color: "#4caf50" }}
                    />
                    <Box
                      sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: "absolute",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        variant="h6"
                        component="div"
                        color="textSecondary"
                      >
                        {expert.match_percentage || 0}%
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    {/* <Typography>Matched Skills:</Typography>
                    <Grid container spacing={1}>
                      {expert.matched_skills.length > 0 ? (
                        expert.matched_skills.map((skill, i) => (
                          <Grid item key={i}>
                            <Chip
                              label={skill}
                              color="success"
                              variant="outlined"
                            />
                          </Grid>
                        ))
                      ) : (
                        <Typography>No skills matched</Typography>
                      )}
                    </Grid> */}

                    {/* Date & Time */}
                    <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                      <TextField
                        label="Select Date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                      />
                      <TextField
                        label="Select Time"
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Box>

                    <Button
                      variant="contained"
                      sx={{ mt: 2 }}
                      onClick={() => handleScheduleInterview(expert)}
                    >
                      Schedule Interview
                    </Button>
                  </Box>
                </Box>
              </Box>
            ))}
          </Paper>
        )}
      </Box>
    </>
  );
}

export default ApplicantDetails;
