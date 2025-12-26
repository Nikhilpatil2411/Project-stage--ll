import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Box } from "@mui/material";

const Layout = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <Header />

      {/* Page content (add pt if Header is fixed) */}
      <Box sx={{ flex: 1, pt: "64px" }}>{children}</Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default Layout;
