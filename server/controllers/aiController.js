import Groq from 'groq-sdk';
import { config } from '../config/config.js';

// Initialize Groq AI
const groq = new Groq({ apiKey: config.groqApiKey });

// Helper to get answers from Groq
const getGroqCompletion = async (prompt) => {
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "llama-3.1-8b-instant",
    temperature: 0.2, // Low temperature for more deterministic JSON output
  });

  return completion.choices[0]?.message?.content || "";
};

// Helper to clean and parse JSON
const parseJSON = (text) => {
  try {
    // Find the first structural character ({ or [)
    const startBrace = text.indexOf('{');
    const startBracket = text.indexOf('[');

    let start = -1;
    if (startBrace !== -1 && startBracket !== -1) {
      start = Math.min(startBrace, startBracket);
    } else {
      start = startBrace !== -1 ? startBrace : startBracket;
    }

    // Find the last structural character (} or ])
    const endBrace = text.lastIndexOf('}');
    const endBracket = text.lastIndexOf(']');
    const end = Math.max(endBrace, endBracket);

    if (start === -1 || end === -1 || end < start) {
      throw new Error("No JSON object or array found in response");
    }

    const jsonText = text.substring(start, end + 1);
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("JSON Parse Error:", error);
    console.error("Raw Text:", text);
    throw new Error("Failed to parse AI response as JSON");
  }
};

// Parse resume text and extract structured data using AI
export const parseResumeWithAI = async (resumeText) => {
  try {
    const prompt = `
You are an expert resume parser. Analyze the following resume text and extract structured information in JSON format.

Resume Text:
${resumeText}

Extract and return ONLY a valid JSON object with the following structure (no markdown, no code blocks, just pure JSON):
{
  "name": "Full name",
  "email": "email@example.com",
  "phone": "phone number",
  "location": "city, country",
  "summary": "professional summary",
  "skills": [
    {
      "name": "skill name",
      "category": "frontend|backend|database|devops|tools|soft-skills|other",
      "proficiency": "beginner|intermediate|advanced|expert"
    }
  ],
  "experience": [
    {
      "company": "company name",
      "position": "job title",
      "duration": "duration",
      "startDate": "start date",
      "endDate": "end date or Present",
      "description": "job description",
      "technologies": ["tech1", "tech2"]
    }
  ],
  "projects": [
    {
      "name": "project name",
      "description": "project description",
      "technologies": ["tech1", "tech2"],
      "role": "your role",
      "duration": "duration",
      "link": "project link if available"
    }
  ],
  "education": [
    {
      "institution": "institution name",
      "degree": "degree type",
      "field": "field of study",
      "graduationYear": "year",
      "gpa": "GPA if mentioned"
    }
  ],
  "certifications": [
    {
      "name": "certification name",
      "issuer": "issuing organization",
      "date": "date obtained",
      "credentialId": "credential ID if available"
    }
  ],
  "techStack": {
      "languages": ["language1", "language2"],
      "frameworks": ["framework1", "framework2"],
      "databases": ["database1", "database2"],
      "tools": ["tool1", "tool2"]
  },
  "experienceLevel": "fresher|junior|mid-level|senior|expert",
  "totalYearsOfExperience": 0
}

IMPORTANT RULES:
1. For skill "category", ONLY use these exact values: frontend, backend, database, devops, tools, soft-skills, other
2. For skill "proficiency", ALWAYS provide one of: beginner, intermediate, advanced, expert
3. If proficiency is not clear from resume, estimate based on context and experience level
4. Be thorough and extract as much information as possible. If a field is not found, use empty string or empty array.
`;

    const response = await getGroqCompletion(prompt);
    console.log('Resume Parsing Response:', response);
    const parsedData = parseJSON(response);

    return {
      success: true,
      data: parsedData
    };

  } catch (error) {
    console.error('Error parsing resume with AI:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Generate interview questions based on resume and role
export const generateInterviewQuestions = async (resume, role, difficulty, numberOfQuestions = 10) => {
  try {
    const resumeSkills = resume.parsedData.skills.map(s => s.name).join(', ');
    const resumeProjects = resume.parsedData.projects.map(p => p.name).join(', ');
    const experienceLevel = resume.parsedData.experienceLevel;

    const prompt = `
You are an expert technical interviewer. Generate ${numberOfQuestions} interview questions for a ${role} position at ${difficulty} difficulty level.

Candidate Profile:
- Experience Level: ${experienceLevel}
- Skills: ${resumeSkills}
- Projects: ${resumeProjects}
- Years of Experience: ${resume.parsedData.totalYearsOfExperience}

CRITICAL REQUIREMENTS:
1. **ROLE-SPECIFIC QUESTIONS**: ALL questions MUST be directly relevant to the ${role} role
   - For Frontend Developer: Focus on HTML, CSS, JavaScript, React, Vue, Angular, responsive design, browser APIs, performance optimization
   - For Backend Developer: Focus on APIs, databases, server architecture, authentication, caching, microservices, scalability
   - For Full Stack Developer: Mix of frontend and backend questions, system design, deployment, full application lifecycle
   - For DevOps Engineer: Focus on CI/CD, containerization, orchestration, cloud platforms, monitoring, infrastructure as code

2. **RESUME-BASED QUESTIONS**: At least 60% of questions should reference specific skills, technologies, or projects from the candidate's resume
   - Ask about specific technologies they mentioned (e.g., "I see you used React in your e-commerce project. Can you explain...")
   - Verify their claimed expertise (e.g., "You mentioned expertise in Node.js. How would you...")
   - Dive deep into their project work (e.g., "In your ${resumeProjects.split(',')[0]} project, how did you handle...")

3. **QUESTION MIX**:
   - 40% Technical concepts specific to ${role}
   - 30% Project-based questions from their resume
   - 20% Resume verification questions
   - 10% Problem-solving scenarios for ${role}

4. **DIFFICULTY ALIGNMENT**: Match ${difficulty} level appropriately

Return ONLY a valid JSON array (no markdown, no code blocks) with this structure:
[
  {
    "questionText": "the question",
    "questionType": "technical|behavioral|project-based|resume-based",
    "difficulty": "easy|medium|hard",
    "relatedSkills": ["skill1", "skill2"],
    "expectedAnswerPoints": ["point1", "point2", "point3"]
  }
]
`;

    const response = await getGroqCompletion(prompt);
    console.log('Interview Questions Response:', response);
    const questions = parseJSON(response);

    return {
      success: true,
      questions
    };

  } catch (error) {
    console.error('Error generating questions:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Evaluate answer based on question and resume context
export const evaluateAnswer = async (question, answer, resumeData) => {
  try {
    const relatedSkills = question.relatedSkills.join(', ');
    const candidateSkills = resumeData.skills.map(s => s.name).join(', ');

    const prompt = `
You are an expert technical interviewer evaluating a candidate's answer.

Question: ${question.questionText}
Question Type: ${question.questionType}
Related Skills: ${relatedSkills}
Difficulty: ${question.difficulty}

Candidate's Answer: ${answer}

Candidate's Resume Claims:
- Skills: ${candidateSkills}
- Experience Level: ${resumeData.experienceLevel}
- Years of Experience: ${resumeData.totalYearsOfExperience}

Evaluate the answer and return ONLY a valid JSON object (no markdown, no code blocks):
{
  "score": 7.5,
  "feedback": "detailed feedback on the answer",
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "suggestions": ["suggestion1", "suggestion2"],
  "matchesResumeClaim": true,
  "resumeClaimVerified": "which skill or claim was verified or contradicted"
}


Scoring Guidelines (BE EXTREMELY STRICT):
- 10: EXCEPTIONAL. Perfect answer with deep technical insight, real-world examples, trade-offs, edge cases, AND best practices. (Reserved for top 0.1%)
- 9: EXCELLENT. Complete, accurate answer with technical depth, multiple approaches, and demonstrates mastery.
- 8: VERY GOOD. Comprehensive answer with good technical details and some depth beyond basics.
- 7: GOOD. Solid answer with correct information and reasonable explanation.
- 6: ACCEPTABLE. Long answer that shows effort and understanding, but lacks depth or has minor gaps.
- 5: BASIC. Correct but textbook/surface-level answer with minimal explanation.
- 4: WEAK. Vague or incomplete answer that shows some understanding but significant gaps.
- 3: POOR. Mostly incorrect or very basic answer with little useful information.
- 2: VERY POOR. Too short (less than 20 words), one-liner, or barely relevant answer.
- 1: MINIMAL. Extremely short answer (less than 10 words) or mostly wrong.
- 0: UNACCEPTABLE. Refusal to answer ("I don't know", "I'm not sure", "Pass"), completely wrong, or irrelevant.

CRITICAL SCORING RULES:
1. REFUSALS = 0 (e.g., "I don't know", "I'm not sure", "Skip", "Pass", "No idea")
2. TOO SHORT (less than 20 words) = MAX 2 points
3. SHORT (20-40 words) without depth = MAX 4 points
4. LONG answers (100+ words) with good content = 6-8 points
5. COMPLETE answers with accuracy and depth = 9-10 points
6. BE DRACONIAN. Start at 0 and make them EARN every point.
7. If answer lacks technical depth or examples, MAX score is 5.
8. To get 6+, answer MUST be detailed with explanations.
9. To get 8+, answer MUST demonstrate deep understanding with trade-offs/best practices.
10. To get 9+, answer MUST be exceptional with real-world insights.

IMPORTANT: You MUST provide at least 2-3 items in strengths, weaknesses, and suggestions arrays. Do not return empty arrays.

Consider:
1. LENGTH (critical factor - short answers cannot score high)
2. Technical accuracy (primary)
3. Depth of understanding (does it go beyond basics?)
4. Whether the answer matches their resume claims
5. Communication clarity
6. Practical examples (bonus points)

`;

    const response = await getGroqCompletion(prompt);

    console.log('AI Evaluation Raw Response:', response);

    const evaluation = parseJSON(response);

    console.log('Parsed Evaluation:', evaluation);

    return {
      success: true,
      evaluation
    };

  } catch (error) {
    console.error('Error evaluating answer:', error);
    console.error('Error details:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

// Generate overall interview summary and feedback
export const generateInterviewSummary = async (interview, resumeData) => {
  try {
    const answeredQuestions = interview.questions.filter(q => q.evaluation);
    const averageScore = interview.stats.averageScore;

    const questionSummary = answeredQuestions.map(q => ({
      question: q.questionText,
      score: q.evaluation.score,
      skills: q.relatedSkills
    }));

    const prompt = `
You are an expert interviewer providing final feedback for a candidate.

Interview Details:
- Role: ${interview.role}
- Difficulty: ${interview.difficulty}
- Average Score: ${averageScore}/10
- Questions Answered: ${answeredQuestions.length}
- Questions Skipped: ${interview.stats.questionsSkipped}

Question Performance:
${JSON.stringify(questionSummary, null, 2)}

Candidate's Resume:
- Experience Level: ${resumeData.experienceLevel}
- Skills Claimed: ${resumeData.skills.map(s => s.name).join(', ')}

Generate comprehensive feedback and return ONLY a valid JSON object (no markdown):
{
  "grade": "A+|A|B+|B|C+|C|D|F",
  "percentage": 85,
  "skillPerformance": [
    {
      "skill": "skill name",
      "averageScore": 7.5,
      "questionsAsked": 3,
      "claimedInResume": true,
      "verified": true
    }
  ],
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2"],
  "resumeSuggestions": ["suggestion1", "suggestion2"],
  "growthOpportunities": [
    {
      "title": "Area to improve",
      "description": "Detailed recommendation for growth"
    }
  ],
  "feedback": "comprehensive overall feedback paragraph",
  "recommendation": "highly-recommended|recommended|maybe|not-recommended"
}

Be honest, constructive, and specific. Highlight resume exaggerations if found.
`;

    const response = await getGroqCompletion(prompt);
    console.log('Interview Summary Response:', response);
    const summary = parseJSON(response);

    return {
      success: true,
      summary
    };

  } catch (error) {
    console.error('Error generating summary:', error);
    return {
      success: false,
      error: error.message
    };
  }
};


