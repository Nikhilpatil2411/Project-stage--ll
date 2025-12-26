# skills_match.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from fuzzywuzzy import fuzz

app = Flask(__name__)
CORS(app)

# Load experts CSV
experts_df = pd.read_csv("experts.csv")  # Make sure this CSV exists

# Synonyms for normalizing skills
skill_synonyms = {
    "js": "javascript",
    "reactjs": "react",
    "ml": "machine learning",
    "nlp": "natural language processing",
    "db": "database",
    "aws": "amazon web services",
}

# Optional weights for important skills
skill_weights = {
    "python": 2,
    "machine learning": 3,
    "nlp": 3,
    "react": 2,
    "node": 1,
    "sql": 2,
    "docker": 2,
    "kubernetes": 2,
    "aws": 3,
    "data science": 3,
}

def normalize_skills(skills):
    """Normalize skill names using synonyms and lowercase"""
    normalized = []
    for skill in skills:
        skill_lower = skill.lower().strip()
        normalized.append(skill_synonyms.get(skill_lower, skill_lower))
    return normalized

def fuzzy_match(candidate_skills, expert_skills, threshold=80):
    """Return list of matched skills between candidate and expert"""
    matched = []
    for c in candidate_skills:
        for e in expert_skills:
            if fuzz.ratio(c, e) >= threshold:
                matched.append(e)
    return list(set(matched))

def calculate_weighted_match(expert_skills, matched_skills):
    if not expert_skills:  # Avoid division by zero
        return 0
    total_weight = sum([skill_weights.get(s, 1) for s in expert_skills])
    matched_weight = sum([skill_weights.get(s, 1) for s in matched_skills])
    return int((matched_weight / total_weight) * 100)

@app.route("/match", methods=["POST"])
def match_skills():
    """API endpoint to match candidate skills with experts"""
    data = request.get_json()
    candidate_skills = normalize_skills(data.get("candidate_skills", []))
    
    results = []
    for _, row in experts_df.iterrows():
        expert_name = row.get("expert_name", "Unknown")
        # Convert email to string and avoid NaN
        expert_email = str(row["email"]) if pd.notna(row["email"]) else ""
        expert_skills = normalize_skills(str(row.get("skills", "")).split(","))
        matched_skills = fuzzy_match(candidate_skills, expert_skills)
        match_percentage = calculate_weighted_match(expert_skills, matched_skills)
        
        results.append({
            "expert_name": expert_name,
            "email": expert_email,
            "matched_skills": matched_skills,
            "match_percentage": match_percentage
        })

    # Sort by match percentage descending and take top 5
    top5 = sorted(results, key=lambda x: x["match_percentage"], reverse=True)[:5]
    return jsonify(top5)

if __name__ == "__main__":
    app.run(port=5001, debug=True)
