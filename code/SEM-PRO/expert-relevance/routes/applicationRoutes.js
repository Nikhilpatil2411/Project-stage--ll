// routes/applicationRoutes.js
import express from "express";
import Application from "../models/Application.js";
import Job from "../models/Jobs.js";
import authMiddleware from "../src/middleware/authMiddleware.js";

const router = express.Router();

// 1️⃣ Apply for a job (Candidate)
router.post("/apply", authMiddleware, async (req, res) => {
  try {
    const { jobId } = req.body;
    if (!jobId) return res.status(400).json({ message: "Job ID is required" });

    // Check duplicate application
    const existing = await Application.findOne({
      jobId,
      candidateId: req.user.id,
    });
    if (existing) return res.status(400).json({ message: "Already applied" });

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Save new application (default status = Pending)
    const application = new Application({
      jobId,
      candidateId: req.user.id,
      candidateName: req.user.name,
      candidateEmail: req.user.email,
      status: "Pending",
    });

    await application.save();
    res.json({ message: "Applied successfully", application });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to apply", error: err.message });
  }
});

// 2️⃣ Get all applicants for a job (Expert who created job)
router.get("/job/:jobId", authMiddleware, async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Only the job creator can see applicants
    if (!job.createdBy.equals(req.user.id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const applications = await Application.find({ jobId })
      .populate("candidateId", "name email skills");

    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch applicants", error: err.message });
  }
});

// 3️⃣ Get all applications by the logged-in candidate
router.get("/my-applications", authMiddleware, async (req, res) => {
  try {
    const applications = await Application.find({ candidateId: req.user.id })
      .populate("jobId"); // include job details

    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch applied jobs", error: err.message });
  }
});

// 4️⃣ Get a single applicant by application ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("candidateId", "name email skills")
      .populate("jobId", "title description");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json(application);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch applicant details", error: err.message });
  }
});

// 5️⃣ Update application status (Expert only)
router.put("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Pending", "Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findById(req.params.id).populate("jobId");
    if (!application) return res.status(404).json({ message: "Application not found" });

    // Ensure only job creator can update status
    if (!application.jobId.createdBy.equals(req.user.id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    application.status = status;
    await application.save();

    res.json({ message: "Status updated successfully", application });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update status", error: err.message });
  }
});

export default router;
