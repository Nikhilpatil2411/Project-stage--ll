import multer from "multer";
import path from "path";
import { exec } from "child_process";

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

export const handleFileUploadAndExtractSkills = (req, res, next) => {
  const uploadSingle = upload.single("resume");

  uploadSingle(req, res, (err) => {
    if (err) {
      console.error("Multer Error:", err);
      return res.status(400).json({ error: "File upload failed" });
    }

    const resumePath = req.file?.path;

    if (!resumePath) {
      console.warn("No resume uploaded");
      return next();
    }

    // Call Python script to extract skills
    exec(
      `python extract_skills.py "${resumePath}"`,
      (error, stdout, stderr) => {
        if (error) {
          console.error("Python Error:", error.message);
          return next();
        }
        if (stderr) {
          console.error("Python stderr:", stderr);
          return next();
        }

        const extractedSkills = stdout
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean);

        console.log("Skills:", extractedSkills);
        req.skills = extractedSkills;
        next();
      }
    );
  });
};
