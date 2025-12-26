// src/pages/Home.jsx
import React, { useContext } from "react";
import Layout from "../components/Layout";
import Banner from "../images/background.png";
import "../styles/HomeStyles.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const { isLoggedIn, role } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (!isLoggedIn) {
      navigate("/login"); // if not logged in → go to login
    } else if (role === "expert") {
      navigate("/expert-dashboard"); // hiring manager
    } else if (role === "candidate") {
      navigate("/dashboard"); // candidate
    } else {
      navigate("/login"); // fallback
    }
  };

  return (
    <Layout>
      <div
        className="home"
        style={{
          height: "100vh",
          width: "100%",
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${Banner})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          color: "white",
          textAlign: "center",
          paddingTop: "80px",
        }}
      >
        <div className="headerContainer">
          <h1>Expert Relevance in Interview Boards</h1>
          <p>
            A smart system to determine the relevance of experts based on <br />
            the interview board's subject and the candidate's area of expertise.
          </p>

          {/* 🔥 Button with dynamic redirect */}
          <button onClick={handleGetStarted}>Get Started</button>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
