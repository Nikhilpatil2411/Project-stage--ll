import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  expertId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional if sent to a specific expert
}, { timestamps: true });

export default mongoose.model("Contact", contactSchema);
