# InterviewIQ 🎯

> **AI-Powered Interview Preparation Platform**  
> Get personalized interview questions, skill gap analysis, and a 30-day prep roadmap powered by Google Gemini AI.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Running Locally](#-running-locally)
- [Building for Production](#-building-for-production)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### **For Job Seekers**

- 🎯 **AI-Generated Interview Questions** - Get 15+ technical and behavioral questions tailored to your target job
- 📊 **Match Score Analysis** - See how well your resume aligns with the job (0-100%)
- 🔍 **Skill Gap Identification** - Discover which skills you're missing and their severity
- 📅 **30-Day Preparation Roadmap** - Get a structured daily plan to prepare
- 💾 **Past Interview History** - Save and revisit all your interview analyses
- 🌓 **Dark/Light Theme** - Switch between Dark and Cream themes for comfortable viewing

### **Technical Highlights**

- 🔐 **Secure Authentication** - JWT-based login with bcryptjs password hashing
- 📄 **PDF Resume Processing** - Automatic text extraction from resume PDFs
- 🤖 **AI Integration** - Powered by Google Generative AI (Gemini API)
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 🎨 **Dynamic Theming** - Dark/Cream themes with smooth transitions
- 👁️ **Password Visibility Toggle** - Show/hide password with eye icon

---

## 🛠️ Tech Stack

### **Frontend**

| Technology   | Version | Purpose                |
| ------------ | ------- | ---------------------- |
| React        | 19.2.4  | UI Framework           |
| React Router | 7.14.0  | Client-side routing    |
| Axios        | 1.14.0  | HTTP requests          |
| SASS/SCSS    | 1.99.0  | Styling with variables |
| Vite         | 8.0.4   | Build tool             |
| React Icons  | 5.6.0   | SVG icons              |

### **Backend**

| Technology           | Version | Purpose             |
| -------------------- | ------- | ------------------- |
| Express.js           | 5.2.1   | REST API framework  |
| MongoDB              | -       | NoSQL database      |
| Mongoose             | 9.4.1   | Database ORM        |
| JWT                  | 9.0.3   | Authentication      |
| bcryptjs             | 3.0.3   | Password hashing    |
| Google Generative AI | 1.49.0  | AI analysis engine  |
| Multer               | 2.1.1   | File uploads        |
| pdf-parse            | 2.4.5   | PDF text extraction |
| Puppeteer            | 24.40.0 | PDF generation      |
| Zod                  | 4.3.6   | Input validation    |

### **Infrastructure**

- **Frontend Hosting:** Vercel
- **Backend Hosting:** Node.js compatible server
- **Database:** MongoDB Atlas
- **AI Service:** Google Generative AI

---

## 🏗️ Architecture

### **System Architecture**

```
Frontend (React)                Backend (Express)              External
   ↓                               ↓                              ↓
┌─────────────────┐          ┌──────────────────┐        ┌────────────────┐
│  React Router   │          │ Express Routes   │        │   MongoDB      │
│  Context API    │ ←────→   │ Controllers      │ ←────→ │   Atlas        │
│  Axios HTTP     │  (JWT)   │ Services         │        │                │
│  SCSS Theming   │          │ Middleware       │        │                │
└─────────────────┘          └──────────────────┘        └────────────────┘
                                     ↓
                             ┌──────────────────┐
                             │ Google Gemini AI │
                             │ (Structured out) │
                             └──────────────────┘
```

### **Data Flow**

**Interview Creation:**

1. User uploads resume (PDF), writes job description, and self description
2. Frontend sends FormData to `POST /api/interview/`
3. Backend extracts text from PDF using pdf-parse
4. Service sends structured prompt to Google Gemini API
5. Gemini returns questions, skill gaps, and prep plan
6. Data saved to MongoDB with user reference
7. Frontend navigates to interview details page

**Authentication:**

1. User registers or logs in
2. Backend hashes password (bcryptjs) and issues JWT
3. JWT stored in HTTP-only cookie
4. Cookie automatically sent with each request
5. Auth middleware verifies JWT signature
6. Logout blacklists token to prevent replay attacks

---

## 📁 Project Structure

```
InterviewIQ/
│
├── client/                          # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Navigation with theme toggle
│   │   │   ├── Layout.jsx          # Main layout wrapper
│   │   │   └── navbar.scss         # Navbar styles
│   │   │
│   │   ├── context/
│   │   │   └── ThemeContext.jsx    # Dark/Cream theme provider
│   │   │
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── pages/
│   │   │   │   │   ├── Login.jsx
│   │   │   │   │   └── Register.jsx
│   │   │   │   ├── hooks/
│   │   │   │   │   └── useAuth.js
│   │   │   │   ├── services/
│   │   │   │   │   └── auth.api.js
│   │   │   │   └── auth.context.jsx
│   │   │   │
│   │   │   └── interview/
│   │   │       ├── pages/
│   │   │       │   ├── Home.jsx    # Create interview
│   │   │       │   ├── Interview.jsx # View report
│   │   │       │   └── PastRequests.jsx # List reports
│   │   │       ├── hooks/
│   │   │       │   └── useInterview.js
│   │   │       ├── services/
│   │   │       │   └── interview.api.js
│   │   │       └── interview.context.jsx
│   │   │
│   │   ├── styles/
│   │   │   └── _theme-variables.scss # CSS custom properties
│   │   │
│   │   ├── App.jsx                 # Root component
│   │   ├── app.routes.jsx          # Routes config
│   │   └── main.jsx                # React DOM entry
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── server/                          # Backend (Node.js + Express)
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js         # MongoDB connection
│   │   │
│   │   ├── models/
│   │   │   ├── user.model.js
│   │   │   ├── interviewReport.model.js
│   │   │   └── blacklist.model.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   └── interview.controller.js
│   │   │
│   │   ├── services/
│   │   │   └── ai.service.js       # Google Gemini integration
│   │   │
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js  # JWT verification
│   │   │   └── file.middleware.js  # Multer config
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   └── interview.routes.js
│   │   │
│   │   └── app.js                  # Express app setup
│   │
│   ├── server.js                   # Entry point
│   ├── package.json
│   ├── .env.example
│   └── .env
│
└── README.md

```

---

## 📋 Prerequisites

### **Required**

- **Node.js** v16+ ([Download](https://nodejs.org/))
- **npm** v7+ (comes with Node.js)
- **MongoDB Atlas Account** ([Sign up free](https://www.mongodb.com/cloud/atlas))
- **Google AI API Key** ([Get here](https://ai.google.dev/))

### **Recommended**

- **Git** for version control
- **VS Code** as code editor
- **Postman** for testing APIs (optional)

---

## 🚀 Installation

### **1. Clone the Repository**

```bash
git clone https://github.com/yourusername/InterviewIQ.git
cd InterviewIQ
```

### **2. Install Frontend Dependencies**

```bash
cd client
npm install
```

### **3. Install Backend Dependencies**

```bash
cd ../server
npm install
```

### **4. Set Up Environment Variables**

Create `.env` file in the `server/` directory:

```bash
# .env (server side)
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/interviewiq?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
GEMINI_API_KEY=your_google_gemini_api_key
```

**How to get these values:**

**MONGODB_URI:**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster (free tier available)
3. Click "Connect" → "Drivers" → Copy connection string
4. Replace `<username>:<password>` with your credentials

**GEMINI_API_KEY:**

1. Go to [Google AI Studio](https://ai.google.dev/)
2. Click "Create API key"
3. Copy the key to `.env`

**JWT_SECRET:**

- Generate a random 32+ character string
- Example: `openssl rand -base64 32` (on Mac/Linux/Git Bash)

---

## 🏃 Running Locally

### **Terminal 1: Start Backend**

```bash
cd server
npm run dev

# Output:
# Server is running on port 3000
```

### **Terminal 2: Start Frontend**

```bash
cd client
npm run dev

# Output:
# VITE v8.0.0  ready in 234 ms
# ➜  Local:   http://localhost:5173/
```

Visit `http://localhost:5173` in your browser. 🎉

---

## 🔨 Building for Production

### **Build Frontend**

```bash
cd client
npm run build

# Output:
# vite v8.0.0 building for production...
# ✓ 156 modules transformed
# dist/index.html                  0.46 kB
# dist/assets/index.xxxxxx.js     145.23 kB
# dist/assets/index.xxxxxx.css     42.15 kB
```

### **Build Backend**

```bash
cd server
npm run build

# Note: Node.js doesn't need building, only verification
npm test
```

---

## 🌐 Deployment

### **Frontend Deployment (Vercel)**

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repo
   - Set build command: `npm run build`
   - Set output directory: `dist`
   - Add environment variable:
     ```
     VITE_API_URL=https://your-backend-url.com
     ```
   - Deploy! 🚀

### **Backend Deployment (Railway / Render / Heroku)**

**Using Railway:**

1. Go to [Railway](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select your repo
4. Railway auto-detects Node.js
5. Add environment variables (MongoDB URI, JWT Secret, Gemini key)
6. Deploy! 🚀

**Using Render:**

1. Go to [Render](https://render.com)
2. Click "New+" → "Web Service"
3. Connect GitHub repo
4. Set build command: `npm install`
5. Set start command: `node server.js`
6. Add environment variables
7. Deploy! 🚀

---

## 📚 API Documentation

### **Authentication Endpoints**

#### **Register User**

```
POST /api/auth/register
Content-Type: application/json

Request:
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}

Response (201):
{
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

#### **Login User**

```
POST /api/auth/login
Content-Type: application/json

Request:
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}

Response (200):
{
  "message": "Login successful",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
Cookie: token=eyJhbGciOiJIUzI1NiIs...
```

#### **Logout User**

```
GET /api/auth/logout

Response (200):
{
  "message": "Logout successful"
}
Cookie: token=; Max-Age=0
```

#### **Get Current User**

```
GET /api/auth/get-me
Authorization: Bearer <token> (in cookie)

Response (200):
{
  "message": "User fetched successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

### **Interview Endpoints**

#### **Generate Interview Report**

```
POST /api/interview/
Content-Type: multipart/form-data
Authorization: Bearer <token>

Request:
- resume: [PDF file]
- jobDescription: "Senior React Developer at Google..."
- selfDescription: "3 years of React experience..."

Response (201):
{
  "message": "Interview report generated successfully",
  "interviewReport": {
    "_id": "507f1f77bcf86cd799439012",
    "user": "507f1f77bcf86cd799439011",
    "matchScore": 78,
    "technicalQuestions": [
      {
        "question": "Explain React hooks lifecycle",
        "intention": "Assess understanding of hooks",
        "answer": "Sample answer..."
      }
    ],
    "behavioralQuestions": [...],
    "skillGaps": [
      {
        "skill": "System Design",
        "level": "high",
        "description": "..."
      }
    ],
    "preparationPlan": [
      {
        "day": 1,
        "focus": "React Fundamentals",
        "tasks": [...]
      }
    ],
    "createdAt": "2024-04-17T10:30:00Z"
  }
}
```

#### **Get All Interview Reports**

```
GET /api/interview/
Authorization: Bearer <token>

Response (200):
{
  "message": "Interview reports fetched successfully",
  "interviewReports": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "matchScore": 78,
      "jobDescription": "...",
      "createdAt": "2024-04-17T10:30:00Z"
    }
  ]
}
```

#### **Get Interview Report by ID**

```
GET /api/interview/report/:interviewId
Authorization: Bearer <token>

Response (200):
{
  "message": "Interview report fetched successfully",
  "interviewReport": { ... }
}
```

#### **Generate PDF Resume**

```
POST /api/interview/resume/pdf/:interviewId
Authorization: Bearer <token>

Response (200):
[PDF file binary data]
```

---

## 📸 Screenshots

### **Login Page**

- Clean login form with email/password fields
- Password visibility toggle (eye icon)
- "Register here" link for new users
- Dark/Cream theme support

### **Home Page**

- Form with 3 inputs: Job Description, Self Description, Resume upload
- Recent interview cards with match scores
- Call-to-action button to generate interview
- Professional layout with icons

### **Interview Report Page**

- Match score display (visual ring with percentage)
- Technical questions section (collapsible)
- Behavioral questions section
- Skill gaps with severity indicators (high/medium/low)
- 30-day preparation roadmap
- Download report as PDF option

### **Past Requests Page**

- List of all past interviews
- Quick statistics per interview
- Search/filter functionality
- Click to view details
- Delete option

---

## 🤝 Contributing

### **How to Contribute**

1. **Fork the Repository**

   ```bash
   git clone https://github.com/yourusername/InterviewIQ.git
   cd InterviewIQ
   ```

2. **Create Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Changes**

   ```bash
   # Edit files
   # Test locally
   npm run dev
   ```

4. **Commit Changes**

   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   # Create Pull Request on GitHub
   ```

### **Code Style**

- Use ESLint: `npm run lint`
- Follow existing patterns
- Add comments for complex logic
- Test before submitting PR

### **Feature Ideas**

- [ ] Video mock interviews with AI feedback
- [ ] Integration with LinkedIn profiles
- [ ] Export report as Word/PDF
- [ ] Real-time collaboration
- [ ] Browser-based IDE for coding questions
- [ ] Integration with calendar (schedule mock interviews)

---

## 📄 License

This project is licensed under the **ISC License**.  
See [LICENSE](LICENSE) file for details.

---

## 📞 Support


- **Email:** amitkumar1553p@gmail.com


---

## 🎯 Roadmap

- **v1.0** - Core features (done)
  - Register/Login
  - Interview generation
  - Skill gap analysis
  - Prep roadmap

- **v1.1** - Enhancements
  - PDF export improvements
  - Email notifications
  - User profile customization
  - Interview history analytics

- **v2.0** - Major features
  - Video mock interviews
  - Real-time collaboration
  - Mobile app
  - Premium subscriptions

---

## 👨‍💻 Authors

- **[Amit Kumar]** - Full Stack Developer

---

**⭐ If you find this helpful, please star the repository!**
