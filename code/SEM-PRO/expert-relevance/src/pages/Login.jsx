// src/pages/Login.jsx
import React, { useState, useContext } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Header from "../components/Header";

const Login = () => {
  const [userType, setUserType] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userType) {
      alert("Please select a role (Candidate or Expert)!");
      return;
    }

    const loginData = { ...formData, userType };

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Save token & role
        login(data.token || "loggedIn", data.user?.userType);

        // ✅ Save user info
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: data.user?.name,
            email: data.user?.email,
            phone: data.user?.number,
            userType: data.user?.userType,
          })
        );

        // ✅ Redirect to correct dashboard
        if (data.user?.userType === "expert") {
          navigate("/expert-dashboard");
        } else {
          navigate("/dashboard"); // Candidate should go here
        }
      } else {
        alert(data.error || "Invalid Credentials");
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
            mt: 15,
            textAlign: "center",
          }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Login
          </Typography>
          <Typography variant="body1" color="textSecondary" mb={3}>
            Select your role and enter your credentials to login.
          </Typography>

          {/* Role Selection */}
          <Grid container spacing={2} justifyContent="center" mb={2}>
            <Grid item xs={6}>
              <Button
                variant={userType === "candidate" ? "contained" : "outlined"}
                onClick={() => setUserType("candidate")}
                fullWidth
              >
                Candidate
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant={userType === "expert" ? "contained" : "outlined"}
                onClick={() => setUserType("expert")}
                fullWidth
              >
                Hiring Manager
              </Button>
            </Grid>
          </Grid>

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
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

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Login
            </Button>
          </form>

          <Typography
            variant="body2"
            mt={2}
            sx={{ cursor: "pointer", color: "blue" }}
            onClick={() => navigate("/register")}
          >
            Don't have an account? Register here
          </Typography>
        </Box>
      </Container>
    </>
  );
};

export default Login;
