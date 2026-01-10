# Evalyn - AI-Powered Interview Platform

A modern, full-stack web application that conducts AI-powered technical interviews with intelligent resume parsing, role-specific question generation, and comprehensive performance evaluation.

## ✨ Features

### 🎯 Core Functionality
- **AI-Powered Resume Parsing**: Upload resumes (PDF/DOCX) with intelligent AI extraction of skills, experience, projects, and technical expertise
- **AI-Generated Role-Specific Interviews**: Dynamically generated questions tailored for Frontend, Backend, Full Stack, and DevOps roles using AI
- **Real-time Speech Recognition**: Answer questions via voice or manual text input with automatic fallback for better accessibility in unsupported browsers
- **AI-Driven Evaluation System**: Strict, intelligent scoring with AI-generated feedback on technical accuracy, depth, and completeness
- **AI-Enhanced Results**: Comprehensive performance breakdown with AI-generated highlights, insights, and personalized recommendations

### 🎨 User Experience
- **Responsive Design**: Fully responsive across mobile, tablet, and desktop
- **Mobile Hamburger Menu**: Smooth slide-in navigation on mobile devices
- **Dark Theme**: Modern, eye-friendly dark interface
- **Smooth Animations**: Framer Motion powered transitions
- **Real-time Feedback**: Live transcript display and progress tracking

### 🔐 Authentication & Security
- **JWT Authentication**: Secure token-based authentication
- **Email Verification**: OTP-based email verification
- **Password Reset**: Secure password recovery flow
- **Protected Routes**: Role-based access control

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **Lucide React** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Groq AI** - Question generation and evaluation
- **Multer** - File upload handling
- **Nodemailer** - Email service
- **PDF-Parse & Mammoth** - Resume parsing

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Groq API key ([Get one here](https://console.groq.com))
- Gmail account for email service (or other SMTP)

## 🚀 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd AI-interviewer
```

### 2. Install dependencies
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### 3. Environment Setup

Create `.env` file in the `server` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/ai-interviewer
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-interviewer

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d

# Groq AI
GROQ_API_KEY=your-groq-api-key-here

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# Frontend URL
CLIENT_URL=http://localhost:5173
```

**Note**: For Gmail, you need to generate an [App Password](https://support.google.com/accounts/answer/185833) instead of using your regular password.

### 4. Run the application

```bash
# From root directory, run both client and server concurrently
npm run dev

# Or run separately:
# Terminal 1 - Server
cd server
npm run dev

# Terminal 2 - Client
cd client
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

## 📱 Usage

1. **Sign Up**: Create an account with email verification
2. **Upload Resume**: Upload your resume (PDF or DOCX format)
3. **Select Role**: Choose from Frontend, Backend, Full Stack, or DevOps
4. **Start Interview**: Begin your AI-powered technical interview
5. **Answer Questions**: Use voice or text input to answer 10 role-specific questions
6. **View Results**: Get detailed performance analysis with scores and feedback

## 🏗️ Project Structure

```
AI-interviewer/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── redux/         # Redux store and slices
│   │   ├── services/      # API services
│   │   ├── hooks/         # Custom React hooks
│   │   └── utils/         # Utility functions
│   └── package.json
├── server/                # Express backend
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── package.json
└── package.json          # Root package.json
```

## 🔧 Available Scripts

### Root Directory
- `npm run dev` - Run both client and server concurrently
- `npm run client` - Run client only
- `npm run server` - Run server only

### Client Directory
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Server Directory
- `npm run dev` - Start server with nodemon
- `npm start` - Start server in production mode
