import React from "react";
import Layout from "../components/Layout";
import { Container, Typography, Grid, Card, CardContent, Avatar, Box } from "@mui/material";
import '../styles/AboutStyles.css'

const teamMembers = [
  { name: "Kuldip Mali", image: "" },
  { name: "Uday Patil", image: "" },
  { name: "Harshal Mahale", image: "" },
  { name: "Harshal Kothawade", image: "" },
  { name: "Nikhil Patil", image: "" },
];

const About = () => {
  return (
    <Layout>
      <Container maxWidth="lg" sx={{ textAlign: "center", mt: 6 }} className="aboutContainer">
        
        {/* About Section */}
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          About Our Project
        </Typography>
        <Typography variant="body1" color="textSecondary" mb={4}>
          This system determines expert relevance with respect to an interview board subject and candidates' area of expertise.
          We aim to improve interview processes by efficiently matching candidates with the right experts.
        </Typography>

        {/* Team Section */}
        <Typography variant="h5" fontWeight="bold" mt={4} mb={3}>
          Meet Our Team
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {teamMembers.map((member, index) => (
            <Grid item xs={12} sm={6} md={2.3} key={index}>
              <Card
                elevation={3}
                sx={{
                  height: 220, // ✅ fixed height
                  width: 180,  // ✅ fixed width
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  p: 2,
                  mx: "auto",
                }}
              >
                <Avatar
                  src={member.image}
                  alt={member.name}
                  sx={{ width: 80, height: 80, mb: 2 }}
                />
                <CardContent sx={{ p: 0 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {member.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Layout>
  );
};

export default About;
