// src/pages/Register.jsx
import { useState } from "react";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import Header from "../components/Header"; // ✅ adjust path if needed

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    number: "",
    resume: null,
  });
  const [extractedSkills, setExtractedSkills] = useState([]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setFormData({ ...formData, resume: file });
    } else {
      alert("Only PDF files are allowed!");
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare JSON body
    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      number: formData.number,
      userType: "candidate", // ✅ hardcoded for now
    };

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);

        // Upload resume if provided
        if (formData.resume) {
          const resumeFormData = new FormData();
          resumeFormData.append("resume", formData.resume);

          await fetch(`http://localhost:5000/api/upload-resume/${data.user._id}`, {
            method: "POST",
            body: resumeFormData,
          });
        }

        // Reset form
        setFormData({
          name: "",
          email: "",
          password: "",
          number: "",
          resume: null,
        });
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="sm">
        <Box
          sx={{
            p: 4,
            boxShadow: 3,
            borderRadius: 2,
            bgcolor: "white",
            mt: 12,
            textAlign: "center",
          }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Candidate Registration
          </Typography>
          <Typography variant="body1" color="textSecondary" mb={3}>
            Fill in your details to register as a candidate.
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              variant="outlined"
              margin="normal"
              required
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              variant="outlined"
              margin="normal"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              variant="outlined"
              margin="normal"
              required
              value={formData.password}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Mobile Number"
              name="number"
              type="tel"
              variant="outlined"
              margin="normal"
              required
              value={formData.number}
              onChange={handleChange}
            />

            <Typography variant="body1" mt={2}>
              Upload Resume (PDF only)
            </Typography>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Register
            </Button>
          </form>

          {extractedSkills.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6">Extracted Skills:</Typography>
              <ul>
                {extractedSkills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </Box>
          )}
        </Box>
      </Container>
    </>
  );
};

export default Register;
