# Determining Expert Relevance with Respect to Interview Board Subject and Candidates’ Area of Expertise

## 📌 Project Overview
This project aims to develop a web-based system that assigns domain-specific experts to candidates based on their skills and expertise. It will help automate and streamline the expert-candidate matching process, ensuring the most relevant expert is assigned for interviews or evaluations.

## 🚀 Key Features
- **Candidate Profile Management** – Users can upload resumes and provide skill details.
- **Expert Profile Management** – Stores expert information including domain, experience, and availability.
- **Automated Matching System** – AI-based recommendation system to assign the best expert to a candidate.
- **Admin Dashboard** – Manage users, track expert assignments, and view reports.
- **Secure Authentication** – User login system for candidates, experts, and admins.
- **Real-time Notifications** – Alert users about assignments and updates.

## 🛠️ Tech Stack
### **Frontend:**
- React.js (User Interface)
- Bootstrap / TailwindCSS (Styling)

### **Backend:**
- Flask (Python-based backend framework)
- Express.js (Node.js backend for API management)

### **Database:**
- MongoDB (For storing candidate and expert profiles)

### **Machine Learning:**
- Python (For expert-candidate matching algorithms)
- Scikit-learn / TensorFlow (For predictive modeling)

### **Deployment:**
- Docker (Containerization)
- AWS / Heroku (Hosting)

## 📂 Project Structure
```
/Expert-Matching-System
│── backend
│   ├── app.py  # Flask backend logic
│   ├── models.py  # Database models
│   ├── routes.py  # API endpoints
│   ├── requirements.txt  # Dependencies
│
│── frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.js  # Main component
│   │   ├── index.js  # Entry point
│
│── database
│   ├── schema.json  # Database schema
│
│── README.md  # Project documentation
```

## 📌 Installation Guide
### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-repo/expert-matching-system.git
cd expert-matching-system
```

### 2️⃣ Backend Setup (Flask)
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### 3️⃣ Frontend Setup (React.js)
```bash
cd frontend
npm install
npm start
```

### 4️⃣ Database Setup (MongoDB)
- Install MongoDB and start the service.
- Import `schema.json` into the database.

## 📊 System Workflow
1. Candidate uploads their resume.
2. System extracts skills and expertise using NLP.
3. Matching algorithm assigns the best-suited expert.
4. Admin verifies the assignment.
5. Both expert and candidate receive notifications.
6. Post-interview, the system collects feedback.

## 📌 Future Enhancements
- **AI-based adaptive learning** to improve expert selection.
- **Video Interview Scheduling** integration.
- **Performance Analytics Dashboard** for insights.

## 💡 Contributors
- **Your Name** – [GitHub Profile](https://github.com/your-github)
- **Team Members** (If applicable)

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
