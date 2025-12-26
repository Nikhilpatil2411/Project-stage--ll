import React from "react";
import { Typography, Box } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const Footer = () => {
  return (
    <Box
      sx={{ textAlign: "center", bgcolor: "#1A1A19", p: 2, color: "#fff" }}
    >
      {/* Social Icons */}
      <Box
        sx={{
          mb: 1,
          "& svg": {
            fontSize: "20px",
            cursor: "pointer",
            mx: 0.5,
            transition: "0.3s",
            "&:hover": { color: "#DB8C3F" },
          },
        }}
      >
        <InstagramIcon />
        <TwitterIcon />
        <FacebookIcon />
        <LinkedInIcon />
      </Box>

      {/* Footer Text */}
      <Typography variant="body2" sx={{ fontSize: "12px" }}>
        © All Rights Reserved | RCPIT
      </Typography>
    </Box>
  );
};

export default Footer;
