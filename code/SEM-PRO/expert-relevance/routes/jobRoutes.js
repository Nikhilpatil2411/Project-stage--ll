// routes/jobRoutes.js
import express from "express";
import Job from "../models/Jobs.js";
import Application from "../models/Application.js";
import authMiddleware from "../src/middleware/authMiddleware.js";

const router = express.Router();

// ------------------ GET all jobs (for users) ------------------
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find(); // fetch all jobs, no filter
    res.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Error fetching jobs", error: error.message });
  }
});

// ------------------ GET jobs for logged-in expert only with applicant count ------------------
router.get("/my-jobs", authMiddleware, async (req, res) => {
  try {
    // Fetch jobs created by this expert
    const jobs = await Job.find({ createdBy: req.user.id });

    // Add applicant count for each job
    const jobsWithCount = await Promise.all(
      jobs.map(async (job) => {
        const count = await Application.countDocuments({ jobId: job._id });
        return { ...job._doc, applicantCount: count }; // _doc gives plain object
      })
    );

    res.json(jobsWithCount);
  } catch (error) {
    console.error("Error fetching expert jobs:", error);
    res.status(500).json({ message: "Error fetching expert jobs", error: error.message });
  }
});

// ------------------ POST new job (experts only) ------------------
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, requirements, pay, level } = req.body;
    if (!title || !description || !requirements) {
      return res.status(400).json({ message: "Title, description, and requirements are required" });
    }

    const job = new Job({
      title,
      description,
      requirements,
      pay,
      level,
      createdBy: req.user.id,
    });

    await job.save();
    res.status(201).json({ job });
  } catch (error) {
    console.error("Error adding job:", error);
    res.status(500).json({ message: "Failed to add job", error: error.message });
  }
});

// ------------------ DELETE job (experts only) ------------------
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Job ID is required" });

    const deletedJob = await Job.findOneAndDelete({ _id: id, createdBy: req.user.id });
    if (!deletedJob) return res.status(404).json({ message: "Job not found" });

    res.json({ message: "Job deleted successfully", job: deletedJob });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ message: "Error deleting job", error: error.message });
  }
});

export default router;
