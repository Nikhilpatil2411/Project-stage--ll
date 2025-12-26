import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  skills: {
    type: [String],
    default: [],
  }
});

const Skill = mongoose.model('Skill', skillSchema);

export default Skill; // ✅ This enables the default import
