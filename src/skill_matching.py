import pandas as pd


# Load expert skills dataset
experts_df = pd.read_csv('data\expert_skills.csv')

# Function to match skills
def match_skills(resume_text, experts_df):
    # Tokenize and extract skills from resume (simplified for now)
    skills = ['python', 'java', 'machine learning', 'react', 'sql', 'data analysis']  # Example skills
    matched_skills = []

    for skill in skills:
        if skill.lower() in resume_text.lower():
            matched_skills.append(skill)

    # Match the resume to the best expert based on the matched skills
    matched_expert = None
    max_match = 0
    for _, expert in experts_df.iterrows():
        expert_skills = expert['Skills'].lower().split(", ")
        common_skills = len(set(matched_skills) & set(expert_skills))
        if common_skills > max_match:
            matched_expert = expert['Name']
            max_match = common_skills

    return matched_expert, matched_skills

# Example of parsing a resume and matching skills
resume_text = extract_text_from_pdf("data/resumes/resume1.pdf")  # Or use docx function
expert, matched_skills = match_skills(resume_text, experts_df)

print(f"Matched Expert: {expert}")
print(f"Matched Skills: {matched_skills}")
