import express from "express";
import User from "../models/User.js";

const router = express.Router();

// GET /api/candidates/expert/:name
router.get("/expert/:name", async (req, res) => {
  try {
    const expert = await User.findOne({ 
      name: { $regex: new RegExp(`^${req.params.name}$`, "i") } 
    });

    if (!expert) return res.status(404).json({ message: "Expert not found" });

    res.json({
      _id: expert._id,
      email: expert.email,
      name: expert.name,
    });
  } catch (err) {
    console.error("Error fetching expert:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
