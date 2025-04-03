from resume_parser import extract_text_from_pdf, extract_text_from_docx
from skill_matching import match_skills
import os

# Directory paths
resume_dir = 'data/resumes/'

# Loop over all resumes in the directory
for filename in os.listdir(resume_dir):
    if filename.endswith('.pdf'):
        resume_text = extract_text_from_pdf(os.path.join(resume_dir, filename))
    elif filename.endswith('.docx'):
        resume_text = extract_text_from_docx(os.path.join(resume_dir, filename))
    else:
        continue

    # Match skills and assign expert
    expert, matched_skills = match_skills(resume_text, experts_df)
    print(f"Resume: {filename}")
    print(f"Assigned Expert: {expert}")
    print(f"Matched Skills: {matched_skills}")
    print("-" * 50)
