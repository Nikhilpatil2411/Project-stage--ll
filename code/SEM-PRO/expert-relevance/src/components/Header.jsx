import React, { useContext, useState, useEffect } from "react";
import {
  AppBar,
  Box,
  IconButton,
  Typography,
  Button,
  Toolbar,
  Stack,
} from "@mui/material";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import { Link, useNavigate } from "react-router-dom";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { isLoggedIn, role, logout } = useContext(AuthContext);

  // track scroll to add blur effect
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // 👉 correct mapping of dashboard routes
  const dashboardRoute = role === "expert" ? "/expert-dashboard" : "/dashboard";

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "transparent",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        boxShadow: scrolled ? "0 2px 10px rgba(0,0,0,0.1)" : "none",
        transition: "all 0.3s ease",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left Side - Logo + Title */}
        <Box display="flex" alignItems="center">
          <IconButton
            sx={{ display: { sm: "none" }, mr: 1 }}
            edge="start"
            color="inherit"
            aria-label="menu"
          >
            <DragHandleIcon />
          </IconButton>
          <AutoStoriesIcon sx={{ color: "#DB8C3F", mr: 1 }} />
          <Typography
            color="#DB8C3F"
            variant="h6"
            fontWeight="bold"
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Hiring Management
          </Typography>
        </Box>

        {/* Right Side - Nav Links */}
        <Stack
          direction="row"
          spacing={3}
          alignItems="center"
          sx={{ display: { xs: "none", sm: "flex" } }}
        >
          <Link to="/" style={{ textDecoration: "none", color: "#DB8C3F" }}>
            Home
          </Link>
          <Link
            to="/about"
            style={{ textDecoration: "none", color: "#DB8C3F" }}
          >
            About
          </Link>

          {/* ✅ Hide Contact if role === "expert" */}
          {role !== "expert" && (
            <Link
              to="/contact"
              style={{ textDecoration: "none", color: "#DB8C3F" }}
            >
              Contact
            </Link>
          )}

          {/* Show Dashboard only after login */}
          {isLoggedIn && (
            <Link
              to={dashboardRoute} // ✅ candidate → /dashboard, expert → /expert-dashboard
              style={{ textDecoration: "none", color: "#DB8C3F" }}
            >
              Dashboard
            </Link>
          )}

          {!isLoggedIn ? (
            <Button
              onClick={() => navigate("/login")}
              variant="outlined"
              size="small"
              sx={{
                color: "#DB8C3F",
                borderColor: "#DB8C3F",
                "&:hover": {
                  backgroundColor: "#DB8C3F",
                  color: "white",
                  borderColor: "#DB8C3F",
                },
              }}
            >
              Login
            </Button>
          ) : (
            <Button
              onClick={handleLogout}
              variant="outlined"
              size="small"
              sx={{
                color: "#DB8C3F",
                borderColor: "#DB8C3F",
                "&:hover": {
                  backgroundColor: "#DB8C3F",
                  color: "white",
                  borderColor: "#DB8C3F",
                },
              }}
            >
              Logout
            </Button>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
