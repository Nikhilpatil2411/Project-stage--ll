import nltk
from nltk.corpus import stopwords
from nltk.tokenize import RegexpTokenizer
import PyPDF2
import sys
import os

# Download NLTK stopwords (only needed once)
nltk.download("stopwords", quiet=True)

def extract_text_from_pdf(pdf_path):
    text = ""
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text
    return text

def extract_skills(text):
    tokenizer = RegexpTokenizer(r'\w+')
    tokens = tokenizer.tokenize(text)
    tokens = [word.lower() for word in tokens]
    stop_words = set(stopwords.words('english'))
    filtered_tokens = [word for word in tokens if word not in stop_words]

    # Expanded comprehensive IT skills list
    skills_list = [
        # Programming Languages
        'python', 'java', 'javascript', 'typescript', 'c', 'c++', 'c#', 'ruby', 'go', 'php', 'swift', 'kotlin', 'dart',
        # Web Development
        'html', 'css', 'react', 'angular', 'vue', 'node', 'express', 'next.js', 'nuxt.js', 'django', 'flask', 'laravel', 'spring', 'spring boot',
        # Databases
        'sql', 'mysql', 'postgresql', 'mongodb', 'sqlite', 'redis', 'oracle', 'cassandra',
        # Cloud & DevOps
        'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'ci/cd', 'terraform', 'ansible',
        # Data Science & AI
        'machine learning', 'deep learning', 'nlp', 'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'pandas', 'numpy', 'matplotlib', 'seaborn',
        # Mobile Development
        'android', 'ios', 'flutter', 'react native', 'swift', 'kotlin',
        # Other skills
        'git', 'rest api', 'graphql', 'microservices', 'agile', 'scrum', 'linux', 'bash', 'shell scripting', 'powerbi', 'tableau', 'spark', 'hadoop',
        'big data', 'data engineering', 'etl', 'software testing', 'selenium', 'cypress'
    ]

    resume_text_lower = text.lower()
    extracted_skills = []

    for skill in skills_list:
        if skill in resume_text_lower and skill not in extracted_skills:
            extracted_skills.append(skill)

    for skill in skills_list:
        if skill in filtered_tokens and skill not in extracted_skills:
            extracted_skills.append(skill)

    return extracted_skills

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python extract_skills.py <resume_path>")
        sys.exit(1)

    resume_path = sys.argv[1]

    if not os.path.exists(resume_path):
        print(f"File not found: {resume_path}")
        sys.exit(1)

    text = extract_text_from_pdf(resume_path)
    skills = extract_skills(text)

    # Print comma-separated skills only (for Node.js to read)
    print(",".join(skills))
