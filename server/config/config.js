import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-interviewer',
  geminiApiKey: process.env.GEMINI_API_KEY,
  groqApiKey: process.env.GROQ_API_KEY,
  jwtSecret: process.env.JWT_SECRET || 'default-secret-change-in-production',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760, // 10MB default

  // Email configuration
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD
  },

  // Interview settings
  interviewSettings: {
    maxReRecords: 1,
    maxSkips: 2,
    questionTimeLimit: 300, // 5 minutes per question in seconds
    difficultyLevels: {
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard'
    },
    roles: {
      frontend: 'Frontend Developer',
      backend: 'Backend Developer',
      fullstack: 'Full Stack Developer',
      dsa: 'Data Structures & Algorithms',
      hr: 'HR Interview'
    }
  }
};
