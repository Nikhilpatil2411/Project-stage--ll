// utils/extractSkillsPython.js
const { spawn } = require("child_process");

function extractSkillsUsingPython(filePath) {
  return new Promise((resolve, reject) => {
    const python = spawn("python3", ["extract_skills.py", filePath]);

    let data = "";
    python.stdout.on("data", (chunk) => {
      data += chunk.toString();
    });

    python.stderr.on("data", (err) => {
      console.error("Python error:", err.toString());
    });

    python.on("close", (code) => {
      try {
        const skills = JSON.parse(data);
        resolve(skills);
      } catch (e) {
        reject("Failed to parse Python output");
      }
    });
  });
}

module.exports = extractSkillsUsingPython;
