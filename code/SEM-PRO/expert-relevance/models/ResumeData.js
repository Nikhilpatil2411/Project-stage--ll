import mongoose from "mongoose";

const resumeDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  skills: [String],
  interests: [String],
});

export default mongoose.model("ResumeData", resumeDataSchema);
