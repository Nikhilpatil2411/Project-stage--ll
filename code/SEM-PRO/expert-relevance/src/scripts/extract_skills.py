# extract_skills.py
import sys
import re
import json
from pdfminer.high_level import extract_text
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

# Download stopwords the first time
import nltk
nltk.download('punkt')
nltk.download('stopwords')

def extract_keywords(pdf_path):
    text = extract_text(pdf_path)
    words = word_tokenize(text.lower())
    stop_words = set(stopwords.words("english"))

    # Basic skill set for demo
    skills_keywords = {"python", "java", "c++", "sql", "node.js", "react", "excel", "machine learning", "communication"}

    filtered = [w for w in words if w not in stop_words and w.isalnum()]
    extracted = list(set(filtered) & skills_keywords)

    return extracted

if __name__ == "__main__":
    pdf_path = sys.argv[1]
    skills = extract_keywords(pdf_path)
    print(json.dumps(skills))




