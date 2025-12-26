// routes/interviewRoutes.js
import express from "express";
import nodemailer from "nodemailer";
import Application from "../models/Application.js";

const router = express.Router();

// POST /api/interviews/schedule
router.post("/schedule", async (req, res) => {
  const { applicationId, expertName, expertEmail, date, time } = req.body;

  try {
    // Fetch application and candidate
    const application = await Application.findById(applicationId).populate(
      "candidateId"
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const candidate = application.candidateId;
    if (!candidate || !candidate.email) {
      return res.status(404).json({ message: "Candidate email not found" });
    }

    const candidateName = candidate.name;
    const candidateEmail = candidate.email;

    // Safety check for expert email
    if (!expertEmail) {
      return res.status(400).json({ message: "Expert email not provided" });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log("Candidate Email:", candidateEmail);
    console.log("Expert Email:", expertEmail);

    // Send email to candidate
    await transporter.sendMail({
      from: `"Hiring Manager" <${process.env.EMAIL_USER}>`,
      to: candidateEmail,
      subject: "Your Interview Has Been Scheduled",
      text: `Dear ${candidateName},\n\nWe are pleased to inform you that your interview with ${expertName} has been successfully scheduled.\n\nDetails:\n- Date: ${date}\n- Time: ${time}\n\nPlease ensure that you are available at the scheduled time. If you have any questions or need to reschedule, feel free to contact us.\n\nBest regards,\nHiring Management Team`,
    });

    // Send email to expert
    await transporter.sendMail({
      from: `"Hiring Manager" <${process.env.EMAIL_USER}>`,
      to: expertEmail,
      subject: "Interview Assignment Notification",
      text: `Dear ${expertName},\n\nYou have been assigned to conduct an interview with ${candidateName}.\n\nDetails:\n- Date: ${date}\n- Time: ${time}\n\nPlease ensure your availability. For any queries, you may contact us.\n\nBest regards,\nHiring Management Team`,
    });

    res.status(200).json({ message: "Emails sent successfully" });
  } catch (err) {
    console.error("Error scheduling interview:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
