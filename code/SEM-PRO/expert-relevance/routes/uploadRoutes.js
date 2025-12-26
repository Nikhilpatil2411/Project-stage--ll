import express from "express";
import multer from "multer";
import User from "../models/User.js";
import fs from "fs";
import path from "path";
import { spawn } from "child_process";

const router = express.Router();

// Set up multer storage
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const userId = req.params.userId;
    const timestamp = Date.now();
    const fileExtension = file.originalname.split(".").pop();
    const newFileName = `${userId}-${timestamp}.${fileExtension}`;
    cb(null, newFileName);
  },
});

const upload = multer({ storage });

// 🟩 Upload + Extract Skills Route
router.post(
  "/upload-resume/:userId",
  upload.single("resume"),
  async (req, res) => {
    try {
      const userId = req.params.userId;
      const resumePath = req.file.path;

      console.log("Resume uploaded for user:", userId);
      console.log("File path:", resumePath);

      // Run Python script to extract skills
      const pythonProcess = spawn("python", ["extract_skills.py", resumePath]);

      let extractedSkills = "";
      pythonProcess.stdout.on("data", (data) => {
        extractedSkills += data.toString();
      });

      pythonProcess.stderr.on("data", (data) => {
        console.error(`Python error: ${data}`);
      });

      pythonProcess.on("close", async (code) => {
        console.log(`Python process exited with code ${code}`);
        const skillsArray = extractedSkills.trim().split(",");

        // Update user with resume path and skills
        await User.findByIdAndUpdate(userId, {
          resume: resumePath,
          skills: skillsArray,
        });

        res.status(200).json({
          message: "Resume uploaded and skills extracted successfully",
          skills: skillsArray,
        });
      });
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({ error: "Failed to upload resume" });
    }
  }
);

export default router;
