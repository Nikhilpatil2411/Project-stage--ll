import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import loginRoutes from "./routes/loginRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import jobsRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", uploadRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/auth", loginRoutes);
app.use("/api/jobs", jobsRoutes); // ✅ register jobs route
app.use("/api/applications", applicationRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/interviews", interviewRoutes);

mongoose
  .connect("mongodb://127.0.0.1:27017/expert_relevances")
  .then(() => {
    console.log("Database Connected Successfully!");
    app.listen(5000, () => console.log("Server Started on Port 5000"));
  })
  .catch((err) => console.error("DB Connection Error:", err));
