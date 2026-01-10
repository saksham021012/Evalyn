# AI Interviewer

AI-powered technical interview platform with real-time video recording, speech-to-text evaluation, and comprehensive feedback.

## Quick Start

### Install Dependencies
```bash
npm run install-all
```

### Run Development Servers
```bash
npm run dev
```

This will start:
- **Backend** (Yellow) - `http://localhost:5000`
- **Frontend** (Blue) - `http://localhost:3000`

### Individual Servers

**Backend only:**
```bash
npm run server
```

**Frontend only:**
```bash
npm run client
```

## Project Structure

```
ai-interviewer/
├── server/          # Backend (Node.js + Express + MongoDB)
├── client/          # Frontend (React + Vite)
└── package.json     # Root scripts
```

## Environment Setup

### Backend (.env in server/)
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

### Frontend (.env in client/)
```
VITE_API_URL=http://localhost:5000/api
```

## Features

- 🔐 JWT Authentication with Email OTP
- 📄 Resume Upload & AI Analysis
- 🎥 Real-time Video Recording
- 🗣️ Speech-to-Text Evaluation
- 🤖 AI-Powered Question Generation
- 📊 Comprehensive Performance Reports
- 📱 Responsive Design

## Tech Stack

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Gemini AI API
- PDF-Parse
- Nodemailer

**Frontend:**
- React + Vite
- Redux Toolkit
- React Router
- Axios
- Framer Motion
- jsPDF
- react-hot-toast
