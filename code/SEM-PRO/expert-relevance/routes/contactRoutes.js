import express from "express";
import Contact from "../models/Contact.js";
import authMiddleware from "../src/middleware/authMiddleware.js";

const router = express.Router();

// ------------------ Candidate sends a contact/query ------------------
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message)
      return res.status(400).json({ message: "All fields are required" });

    const contact = new Contact({ name, email, message });
    await contact.save();
    res.status(201).json({ message: "Contact sent successfully", contact });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to send contact", error: err.message });
  }
});

// ------------------ Expert fetches all contacts ------------------
router.get("/my-contacts", authMiddleware, async (req, res) => {
  try {
    const contacts = await Contact.find(); // you can filter by expertId if needed
    res.json(contacts);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to fetch contacts", error: err.message });
  }
});

export default router;
