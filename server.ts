import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize Gemini SDK with User-Agent header as required
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

console.log(`[CareerPilot AI] Gemini AI initialized: ${Boolean(ai ? 'YES' : 'NO (Demo fallback mode)')}`);

// Health and AI status endpoint
app.get('/api/status', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGemini: Boolean(ai),
    model: 'gemini-3.8-flash',
    appName: 'CareerPilot AI – Smart Placement Assistant',
  });
});

// Helper for Gemini JSON calls with automatic fallback
async function callGemini(prompt: string, systemInstruction: string): Promise<string | null> {
  if (!ai) return null;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });
    return response.text ?? null;
  } catch (error) {
    console.error('[CareerPilot AI] Gemini API error:', error);
    return null;
  }
}

// -------------------------------------------------------------
// 1. AI LEARNING ROADMAP
// -------------------------------------------------------------
app.post('/api/roadmap/generate', async (req: Request, res: Response) => {
  const {
    name = 'Student',
    branch = 'CSE',
    yearOfStudy = '3rd Year',
    targetRole = 'Software Development Engineer (SDE)',
    technicalSkills = ['C++', 'Python', 'Data Structures'],
    dailyStudyHours = 3,
    currentProficiency = 'Intermediate',
  } = req.body;

  const systemInstruction = `You are an elite campus placement mentor and Head of Technical Curriculum for engineering colleges.
Return a realistic, structured 6-week placement preparation roadmap in valid JSON format only.
Must cover Data Structures & Algorithms, DBMS, Operating Systems, Computer Networks, SQL, and specific tech stack for the target role.
JSON schema:
{
  "roleSummary": "string",
  "targetRole": "string",
  "totalWeeks": 6,
  "weeklyCommitmentHours": number,
  "milestones": ["string"],
  "weeks": [
    {
      "weekNumber": number,
      "theme": "string",
      "goal": "string",
      "topics": [
        {
          "id": "string",
          "title": "string",
          "category": "DSA" | "DBMS" | "OS" | "CN" | "SQL" | "TechStack" | "AIML" | "Aptitude",
          "estimatedHours": number,
          "keyConcepts": ["string"],
          "practiceExercise": "string",
          "difficulty": "Beginner" | "Intermediate" | "Advanced"
        }
      ]
    }
  ]
}`;

  const prompt = `Generate a personalized 6-week placement roadmap for:
Student Name: ${name}
Branch: ${branch}
Year of Study: ${yearOfStudy}
Target Role: ${targetRole}
Existing Skills: ${Array.isArray(technicalSkills) ? technicalSkills.join(', ') : technicalSkills}
Daily Study Hours: ${dailyStudyHours} hours/day (Weekly: ${dailyStudyHours * 6} hours)
Current Proficiency: ${currentProficiency}

Ensure clear milestones, actionable LeetCode/GeeksforGeeks practice exercises, and core CS fundamentals topics.`;

  const rawJson = await callGemini(prompt, systemInstruction);

  if (rawJson) {
    try {
      const parsed = JSON.parse(rawJson);
      return res.json({ ...parsed, isAiGenerated: true });
    } catch (e) {
      console.warn('Failed to parse Gemini roadmap JSON, using fallback generator', e);
    }
  }

  // High-fidelity curated fallback roadmap tailored to role
  const fallback = generateCuratedRoadmap(targetRole, dailyStudyHours, branch);
  return res.json({ ...fallback, isAiGenerated: false });
});

// -------------------------------------------------------------
// 2. AI RESUME ANALYZER
// -------------------------------------------------------------
app.post('/api/resume/analyze', async (req: Request, res: Response) => {
  const {
    resumeText = '',
    targetRole = 'Software Development Engineer',
    targetCompanyType = 'Product Companies (Tier 1/Tier 2)',
  } = req.body;

  if (!resumeText || resumeText.trim().length < 40) {
    return res.status(400).json({ error: 'Please provide at least 40 characters of resume content to analyze.' });
  }

  const systemInstruction = `You are a Principal Tech Recruiter and ATS (Applicant Tracking System) Evaluation Engine for campus placements.
Analyze the student resume text thoroughly and objectively.
Return strictly valid JSON with this schema:
{
  "score": number (0 to 100),
  "verdict": "Campus Ready - Tier 1" | "Strong Contender - Needs Polish" | "Needs Fundamental Enhancement",
  "sectionScores": {
    "contactAndSummary": number (0-20),
    "technicalSkills": number (0-25),
    "projectImpact": number (0-30),
    "educationAndAchievements": number (0-15),
    "atsFormatting": number (0-10)
  },
  "detectedSkills": ["string"],
  "missingSkills": ["string"],
  "strengths": ["string"],
  "actionableImprovements": [
    {
      "area": "string",
      "issue": "string",
      "recommendation": "string",
      "exampleFix": "string"
    }
  ],
  "improvedSummary": "string",
  "bulletFixSuggestions": [
    {
      "original": "string",
      "improved": "string",
      "rationale": "string"
    }
  ]
}`;

  const prompt = `Target Role: ${targetRole}
Target Company Type: ${targetCompanyType}

Resume Text:
"""
${resumeText.slice(0, 5000)}
"""

Evaluate for action verbs, quantifiable metrics, tech stack relevance, ATS parseability, and college project depth.`;

  const rawJson = await callGemini(prompt, systemInstruction);

  if (rawJson) {
    try {
      const parsed = JSON.parse(rawJson);
      return res.json({ ...parsed, isAiGenerated: true });
    } catch (e) {
      console.warn('Failed to parse Gemini resume JSON, using fallback analyzer', e);
    }
  }

  // Rule-based ATS analysis fallback
  const fallback = ruleBasedResumeAnalysis(resumeText, targetRole);
  return res.json({ ...fallback, isAiGenerated: false });
});

// -------------------------------------------------------------
// 3. JOB DESCRIPTION MATCHER
// -------------------------------------------------------------
app.post('/api/jd/match', async (req: Request, res: Response) => {
  const {
    jobDescription = '',
    userSkills = [],
    resumeText = '',
    targetRole = 'Software Engineer',
  } = req.body;

  if (!jobDescription || jobDescription.trim().length < 30) {
    return res.status(400).json({ error: 'Please provide a valid job or internship description.' });
  }

  const skillsList = Array.isArray(userSkills) ? userSkills : [];

  const systemInstruction = `You are a Technical Hiring Manager and Job Fit Matcher.
Compare the student's background against the job description.
Do NOT fabricate scores; follow a transparent criteria:
- Required core tech stack coverage: 40%
- CS Fundamentals & Problem Solving fit: 30%
- Projects & Practical implementation: 20%
- Soft skills / qualifications: 10%
Return strictly valid JSON:
{
  "matchScore": number (0 to 100),
  "scoreBreakdown": {
    "coreTechCoverage": number (0-40),
    "csFundamentals": number (0-30),
    "practicalProjects": number (0-20),
    "qualifications": number (0-10)
  },
  "matchingSkills": ["string"],
  "missingSkills": ["string"],
  "bonusSkills": ["string"],
  "keyRoleResponsibilities": ["string"],
  "recommendedPrepPlan": [
    {
      "skill": "string",
      "importance": "High" | "Medium",
      "actionItem": "string",
      "estimatedDays": number
    }
  ],
  "predictedInterviewQuestions": ["string"]
}`;

  const prompt = `Candidate Profile:
Target Role: ${targetRole}
Known Skills: ${skillsList.join(', ')}
Candidate Resume Summary/Text: ${resumeText ? resumeText.slice(0, 1500) : 'None provided; use skills list'}

Job Description:
"""
${jobDescription.slice(0, 4000)}
"""`;

  const rawJson = await callGemini(prompt, systemInstruction);

  if (rawJson) {
    try {
      const parsed = JSON.parse(rawJson);
      return res.json({ ...parsed, isAiGenerated: true });
    } catch (e) {
      console.warn('Failed to parse Gemini JD match JSON, using fallback matcher', e);
    }
  }

  // Transparent algorithmic matcher fallback
  const fallback = algorithmicJdMatcher(jobDescription, skillsList, resumeText);
  return res.json({ ...fallback, isAiGenerated: false });
});

// -------------------------------------------------------------
// 4. AI INTERVIEW COACH - QUESTION GENERATOR & EVALUATOR
// -------------------------------------------------------------
app.post('/api/interview/generate-questions', async (req: Request, res: Response) => {
  const {
    subject = 'DSA',
    difficulty = 'Intermediate',
    count = 3,
  } = req.body;

  const systemInstruction = `You are a Senior Technical Interviewer at top tech companies conducting campus interviews.
Return strictly valid JSON array of interview questions:
[
  {
    "id": "string",
    "subject": "string",
    "difficulty": "Beginner" | "Intermediate" | "Advanced",
    "question": "string",
    "context": "string",
    "hint": "string",
    "keyConcepts": ["string"],
    "expectedAnswerOutline": "string",
    "sampleCodeSnippet": "string"
  }
]`;

  const prompt = `Generate ${count} authentic campus placement technical interview questions for:
Subject: ${subject}
Difficulty Level: ${difficulty}
Ensure questions test actual conceptual understanding and reasoning, typical in Amazon, TCS Digital, Infosys SP, Cognizant, or Startups.`;

  const rawJson = await callGemini(prompt, systemInstruction);

  if (rawJson) {
    try {
      const parsed = JSON.parse(rawJson);
      return res.json({ questions: parsed, isAiGenerated: true });
    } catch (e) {
      console.warn('Failed to parse interview questions JSON', e);
    }
  }

  const fallbackQuestions = getCuratedInterviewQuestions(subject, difficulty, count);
  return res.json({ questions: fallbackQuestions, isAiGenerated: false });
});

app.post('/api/interview/evaluate-answer', async (req: Request, res: Response) => {
  const {
    question = '',
    subject = 'DSA',
    studentAnswer = '',
    difficulty = 'Intermediate',
  } = req.body;

  if (!studentAnswer || studentAnswer.trim().length < 5) {
    return res.status(400).json({ error: 'Please enter a substantive answer to evaluate.' });
  }

  const systemInstruction = `You are a supportive, high-standards Engineering Interviewer evaluating a candidate's answer.
Return strictly valid JSON:
{
  "score": number (1 to 10),
  "verdict": "Excellent" | "Good - Minor Gaps" | "Needs Revision",
  "correctnessFeedback": "string",
  "clarityFeedback": "string",
  "keyConceptsCovered": ["string"],
  "keyPointsMissed": ["string"],
  "modelAnswer": "string",
  "tipsForLiveInterview": "string"
}`;

  const prompt = `Question: "${question}"
Subject: ${subject}
Difficulty: ${difficulty}
Student's Typed Answer:
"""
${studentAnswer}
"""

Provide constructive, specific, and actionable evaluation. Explain why concepts were right or missed.`;

  const rawJson = await callGemini(prompt, systemInstruction);

  if (rawJson) {
    try {
      const parsed = JSON.parse(rawJson);
      return res.json({ ...parsed, isAiGenerated: true });
    } catch (e) {
      console.warn('Failed to parse answer evaluation JSON', e);
    }
  }

  const fallback = evaluateAnswerRuleBased(question, studentAnswer, subject);
  return res.json({ ...fallback, isAiGenerated: false });
});

// -------------------------------------------------------------
// 5. PROJECT PORTFOLIO RESUME ASSISTANT
// -------------------------------------------------------------
app.post('/api/project/enhance-description', async (req: Request, res: Response) => {
  const {
    title = '',
    problemStatement = '',
    technologies = [],
    roughDescription = '',
    outcome = '',
  } = req.body;

  const systemInstruction = `You are a Tech Career Coach helping engineering students write top-tier project descriptions for resumes and viva presentations using the STAR method (Situation, Task, Action, Result).
Return strictly valid JSON:
{
  "resumeBulletPoints": ["string"],
  "oneLineSummary": "string",
  "vivaTalkingPoints": ["string"],
  "suggestedMetrics": ["string"],
  "githubReadmeSnippet": "string"
}`;

  const prompt = `Project Title: ${title}
Problem Statement: ${problemStatement}
Tech Stack: ${Array.isArray(technologies) ? technologies.join(', ') : technologies}
Raw Description: ${roughDescription}
Project Outcome/Results: ${outcome}

Transform this into powerful bullet points using strong action verbs (Architected, Engineered, Implemented, Benchmarked, Optimized) and quantifiable outcomes.`;

  const rawJson = await callGemini(prompt, systemInstruction);

  if (rawJson) {
    try {
      const parsed = JSON.parse(rawJson);
      return res.json({ ...parsed, isAiGenerated: true });
    } catch (e) {
      console.warn('Failed to parse project enhancement JSON', e);
    }
  }

  // Fallback STAR enhancement
  const fallback = enhanceProjectFallback(title, problemStatement, technologies, roughDescription, outcome);
  return res.json({ ...fallback, isAiGenerated: false });
});

// =============================================================
// CURATED DOMAIN ENGINES (FOR OFFLINE / INSTANT DEMO FALLBACK)
// =============================================================

function generateCuratedRoadmap(role: string, dailyHours: number, branch: string) {
  const isAiml = role.toLowerCase().includes('ai') || role.toLowerCase().includes('data') || branch.includes('AIML');

  return {
    roleSummary: `A comprehensive 6-week fast-track placement roadmap designed specifically for ${role} placements, balancing core CS theory with coding practice.`,
    targetRole: role,
    totalWeeks: 6,
    weeklyCommitmentHours: dailyHours * 6,
    milestones: [
      'Master Time/Space Complexity & Linear Data Structures',
      'Ace Core Trees, Graphs & Dynamic Programming Patterns',
      'Revise Operating Systems, DBMS & Computer Networks CS Fundamentals',
      'Master Complex SQL Queries & Database Normalization',
      'Build/Polish 2 Production Projects & Resume STAR Bullets',
      'Complete 5+ Full Technical & HR Mock Interviews',
    ],
    weeks: [
      {
        weekNumber: 1,
        theme: 'Problem Solving Foundations & Linear DS',
        goal: 'Conquer Arrays, Strings, HashMaps, and Two-Pointer techniques.',
        topics: [
          {
            id: 'w1-t1',
            title: 'Asymptotic Analysis & Array Manipulation',
            category: 'DSA',
            estimatedHours: 4,
            keyConcepts: ['Big-O Notation', 'Sliding Window', 'Two Pointers', 'Prefix Sums'],
            practiceExercise: 'Solve 2 Sum, Best Time to Buy/Sell Stock, Container With Most Water',
            difficulty: 'Beginner',
          },
          {
            id: 'w1-t2',
            title: 'Strings, HashMaps & Sets',
            category: 'DSA',
            estimatedHours: 4,
            keyConcepts: ['Collision Resolution', 'Frequency Counters', 'Anagrams', 'Palindrome Substrings'],
            practiceExercise: 'Group Anagrams, Longest Substring Without Repeating Characters',
            difficulty: 'Beginner',
          },
          {
            id: 'w1-t3',
            title: 'Linked Lists & Stack/Queue Internals',
            category: 'DSA',
            estimatedHours: 4,
            keyConcepts: ['Cycle Detection (Floyd)', 'Reverse Linked List', 'Monotonic Stack'],
            practiceExercise: 'Detect Cycle II, Valid Parentheses, Daily Temperatures',
            difficulty: 'Intermediate',
          },
          {
            id: 'w1-t4',
            title: 'SQL Fundamentals & DDL/DML',
            category: 'SQL',
            estimatedHours: 3,
            keyConcepts: ['SELECT, WHERE, GROUP BY, HAVING', 'Aggregate Functions', 'Primary vs Foreign Keys'],
            practiceExercise: 'Write queries for Department Highest Salary and Duplicate Emails on LeetCode SQL',
            difficulty: 'Beginner',
          },
        ],
      },
      {
        weekNumber: 2,
        theme: 'Recursion, Trees & Binary Search',
        goal: 'Master Tree Traversals, BST Properties, and Divide & Conquer.',
        topics: [
          {
            id: 'w2-t1',
            title: 'Binary Trees & Traversals',
            category: 'DSA',
            estimatedHours: 5,
            keyConcepts: ['Inorder/Preorder/Postorder', 'Level Order (BFS)', 'Lowest Common Ancestor'],
            practiceExercise: 'Maximum Depth of Binary Tree, Diameter of Binary Tree, LCA of BST',
            difficulty: 'Intermediate',
          },
          {
            id: 'w2-t2',
            title: 'Binary Search & Monotonic Conditions',
            category: 'DSA',
            estimatedHours: 4,
            keyConcepts: ['Binary Search on Answer', 'Search in Rotated Sorted Array', 'First/Last Position'],
            practiceExercise: 'Search in Rotated Sorted Array, Koko Eating Bananas',
            difficulty: 'Intermediate',
          },
          {
            id: 'w2-t3',
            title: 'Operating Systems: Process & Threads',
            category: 'OS',
            estimatedHours: 4,
            keyConcepts: ['Process vs Thread', 'Context Switching', 'CPU Scheduling (Round Robin, SJF)'],
            practiceExercise: 'Explain the difference between Concurrency and Parallelism with diagrams',
            difficulty: 'Intermediate',
          },
        ],
      },
      {
        weekNumber: 3,
        theme: 'Graphs, BFS/DFS & Memory Management',
        goal: 'Understand Graph representations, topological sort, and OS memory.',
        topics: [
          {
            id: 'w3-t1',
            title: 'Graph Traversals (BFS & DFS)',
            category: 'DSA',
            estimatedHours: 5,
            keyConcepts: ['Adjacency List/Matrix', 'Connected Components', 'Cycle Detection in Directed Graphs'],
            practiceExercise: 'Number of Islands, Clone Graph, Course Schedule (Topological Sort)',
            difficulty: 'Intermediate',
          },
          {
            id: 'w3-t2',
            title: 'Shortest Path & Disjoint Set Union (DSU)',
            category: 'DSA',
            estimatedHours: 4,
            keyConcepts: ['Dijkstra Algorithm', 'Union-Find with Path Compression', 'Minimum Spanning Tree'],
            practiceExercise: 'Network Delay Time, Redundant Connection',
            difficulty: 'Advanced',
          },
          {
            id: 'w3-t3',
            title: 'OS: Deadlocks & Virtual Memory',
            category: 'OS',
            estimatedHours: 4,
            keyConcepts: ["Banker's Algorithm", 'Conditions for Deadlock', 'Paging & Segmentation', 'Page Faults (LRU)'],
            practiceExercise: 'Write out the 4 Coffman conditions and demonstrate LRU replacement algorithm',
            difficulty: 'Intermediate',
          },
        ],
      },
      {
        weekNumber: 4,
        theme: 'Dynamic Programming & DBMS Transactions',
        goal: 'Break through DP phobia (1D/2D patterns) and ACID properties.',
        topics: [
          {
            id: 'w4-t1',
            title: 'Dynamic Programming (1D Patterns)',
            category: 'DSA',
            estimatedHours: 5,
            keyConcepts: ['Memoization vs Tabulation', 'Fibonacci Pattern', 'Coin Change', 'House Robber'],
            practiceExercise: 'Climbing Stairs, Coin Change, Longest Increasing Subsequence',
            difficulty: 'Intermediate',
          },
          {
            id: 'w4-t2',
            title: 'Dynamic Programming (2D & Strings)',
            category: 'DSA',
            estimatedHours: 5,
            keyConcepts: ['Longest Common Subsequence (LCS)', '0/1 Knapsack', 'Edit Distance'],
            practiceExercise: 'LCS, Edit Distance, Unique Paths',
            difficulty: 'Advanced',
          },
          {
            id: 'w4-t3',
            title: 'DBMS: ACID & Normalization',
            category: 'DBMS',
            estimatedHours: 4,
            keyConcepts: ['Atomicity, Consistency, Isolation, Durability', '1NF, 2NF, 3NF, BCNF', 'B-Tree Indexing'],
            practiceExercise: 'Decompose an unnormalized schema into 3NF and explain Indexing overhead',
            difficulty: 'Intermediate',
          },
        ],
      },
      {
        weekNumber: 5,
        theme: isAiml ? 'AIML Algorithms & Computer Networks' : 'System Design Fundamentals & Computer Networks',
        goal: 'Master networking protocols and domain-specific engineering.',
        topics: [
          {
            id: 'w5-t1',
            title: 'Computer Networks: OSI & TCP/IP Stack',
            category: 'CN',
            estimatedHours: 4,
            keyConcepts: ['TCP 3-Way Handshake', 'UDP vs TCP', 'DNS Lookup Flow', 'HTTP vs HTTPS / TLS'],
            practiceExercise: 'Answer viva question: "What happens when you type google.com in a browser?"',
            difficulty: 'Intermediate',
          },
          {
            id: 'w5-t2',
            title: isAiml ? 'Machine Learning Fundamentals & Loss Functions' : 'OOPs Concepts & Design Patterns',
            category: isAiml ? 'AIML' : 'TechStack',
            estimatedHours: 5,
            keyConcepts: isAiml
              ? ['Supervised vs Unsupervised', 'Bias-Variance Tradeoff', 'Cross-Entropy vs MSE', 'Precision/Recall']
              : ['Encapsulation, Polymorphism, Abstraction', 'Singleton & Factory Patterns', 'SOLID Principles'],
            practiceExercise: isAiml
              ? 'Derive Gradient Descent for Linear Regression and explain Overfitting prevention'
              : 'Implement a thread-safe Singleton class in Java/C++/Python',
            difficulty: 'Intermediate',
          },
          {
            id: 'w5-t3',
            title: 'Advanced SQL: Window Functions & Subqueries',
            category: 'SQL',
            estimatedHours: 3,
            keyConcepts: ['ROW_NUMBER(), RANK(), DENSE_RANK()', 'LEAD() / LAG()', 'Common Table Expressions (CTEs)'],
            practiceExercise: 'Write query to find 2nd highest salary using DENSE_RANK() and CTE',
            difficulty: 'Intermediate',
          },
        ],
      },
      {
        weekNumber: 6,
        theme: 'Full Mock Rounds, Resume Defenses & HR Prep',
        goal: 'Tie everything together for high-stress interview performance.',
        topics: [
          {
            id: 'w6-t1',
            title: 'Project Deep-Dive Defense',
            category: 'TechStack',
            estimatedHours: 4,
            keyConcepts: ['STAR Method', 'Architecture Diagram', 'Tradeoffs & Scaling bottlenecks', 'Tech Stack Choice'],
            practiceExercise: 'Deliver 3-minute project walkthrough without filler words and answer edge-case questions',
            difficulty: 'Advanced',
          },
          {
            id: 'w6-t2',
            title: 'Timed Technical Mock Interviews',
            category: 'DSA',
            estimatedHours: 4,
            keyConcepts: ['Thinking Out Loud', 'Writing Clean Code', 'Dry Running with Test Cases', 'Handling Hints'],
            practiceExercise: 'Complete 2 simulated 45-minute interviews in CareerPilot Interview Coach',
            difficulty: 'Advanced',
          },
          {
            id: 'w6-t3',
            title: 'HR & Behavioral Competencies',
            category: 'Aptitude',
            estimatedHours: 3,
            keyConcepts: ['Tell Me About Yourself', 'Handling Conflicts', 'Weakness that became a Strength'],
            practiceExercise: 'Prepare 5 story vignettes for situational behavioral questions',
            difficulty: 'Beginner',
          },
        ],
      },
    ],
  };
}

function ruleBasedResumeAnalysis(text: string, targetRole: string) {
  const lower = text.toLowerCase();
  const knownKeywords = [
    'python', 'java', 'c++', 'javascript', 'typescript', 'sql', 'react', 'node.js',
    'docker', 'aws', 'git', 'dsa', 'data structures', 'algorithms', 'html', 'css',
    'express', 'mongodb', 'postgresql', 'mysql', 'rest api', 'machine learning',
    'deep learning', 'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch'
  ];

  const detectedSkills = knownKeywords.filter((k) => lower.includes(k));
  const missingCore = ['dsa', 'sql', 'git', 'rest api', 'docker'].filter((k) => !lower.includes(k));

  const hasNumbers = /\d+%|\d+\s*(users|requests|ms|seconds|accuracy|queries)/i.test(text);
  const hasActionVerbs = /engineered|developed|implemented|optimized|designed|architected|built|led/i.test(lower);
  const hasGithub = /github\.com|portfolio|linkedin/i.test(lower);

  let score = 55;
  if (detectedSkills.length > 5) score += 15;
  if (hasNumbers) score += 12;
  if (hasActionVerbs) score += 10;
  if (hasGithub) score += 8;
  score = Math.min(score, 92);

  return {
    score,
    verdict: score >= 80 ? 'Campus Ready - Tier 1' : 'Strong Contender - Needs Polish',
    sectionScores: {
      contactAndSummary: hasGithub ? 18 : 12,
      technicalSkills: Math.min(25, 12 + detectedSkills.length * 2),
      projectImpact: hasNumbers && hasActionVerbs ? 26 : 16,
      educationAndAchievements: 12,
      atsFormatting: 8,
    },
    detectedSkills: detectedSkills.map((s) => s.toUpperCase()),
    missingSkills: missingCore.map((s) => s.toUpperCase()),
    strengths: [
      'Good technical foundation with relevant programming languages identified.',
      hasGithub ? 'Clear links to code repositories/profiles for technical verification.' : 'Clear academic project listing.',
      hasActionVerbs ? 'Effective use of action verbs in project descriptions.' : 'Covers fundamental engineering curriculum.',
    ],
    actionableImprovements: [
      {
        area: 'Quantifiable Metrics (Impact)',
        issue: hasNumbers ? 'Could highlight deeper scale metrics' : 'Descriptions focus on features rather than measured impact or latency reductions.',
        recommendation: 'Use the Google XYZ Formula: Accomplished [X], as measured by [Y], by doing [Z].',
        exampleFix: 'Instead of "Built a web app with React", write "Engineered responsive web app in React/Node.js serving 450+ campus users with 99.8% uptime."',
      },
      {
        area: 'Core Tech Keywords & ATS Header',
        issue: 'ATS parsers look for standard categorization (Languages, Frameworks, Developer Tools, Core CS).',
        recommendation: 'Organize technical skills into distinct subheadings for fast recruiter skimming.',
        exampleFix: 'Languages: C++, Python, SQL | Frameworks: React, Express | Core CS: OS, DBMS, Computer Networks',
      },
    ],
    improvedSummary: `Ambitious ${targetRole} candidate with solid foundation in Data Structures, Algorithms, and full-stack software development. Proven track record of building reliable web applications and solving 200+ algorithmic problems. Eager to contribute scalable problem-solving skills to high-impact engineering teams.`,
    bulletFixSuggestions: [
      {
        original: 'Worked on a library management project using Java and SQL.',
        improved: 'Architected automated Library Management System in Java & MySQL, implementing normalized schemas that reduced query retrieval latency by 35%.',
        rationale: 'Replaces passive "worked on" with active "Architected" and adds clear performance metrics.',
      },
    ],
  };
}

function algorithmicJdMatcher(jd: string, userSkills: string[], resumeText: string) {
  const combinedUserText = (userSkills.join(' ') + ' ' + (resumeText || '')).toLowerCase();
  const jdLower = jd.toLowerCase();

  const standardSkills = [
    'python', 'java', 'c++', 'c', 'javascript', 'typescript', 'react', 'angular',
    'node.js', 'express', 'sql', 'mysql', 'postgresql', 'mongodb', 'docker',
    'kubernetes', 'aws', 'git', 'linux', 'data structures', 'algorithms',
    'machine learning', 'deep learning', 'pandas', 'numpy', 'rest api', 'graphql',
    'operating systems', 'computer networks', 'dbms', 'html', 'css', 'tailwind'
  ];

  const jdSkills = standardSkills.filter((s) => jdLower.includes(s));
  const matchingSkills = jdSkills.filter((s) => combinedUserText.includes(s));
  const missingSkills = jdSkills.filter((s) => !combinedUserText.includes(s));

  // Transparent calculation:
  // Coverage = (matched / total_jd_skills) * 70 + base 25
  const coverageRatio = jdSkills.length > 0 ? matchingSkills.length / jdSkills.length : 0.6;
  const matchScore = Math.min(95, Math.round(25 + coverageRatio * 65));

  return {
    matchScore,
    scoreBreakdown: {
      coreTechCoverage: Math.round(coverageRatio * 40),
      csFundamentals: 24,
      practicalProjects: 16,
      qualifications: 8,
    },
    matchingSkills: (matchingSkills.length > 0 ? matchingSkills : ['git', 'python']).map((s) => s.toUpperCase()),
    missingSkills: (missingSkills.length > 0 ? missingSkills : ['docker', 'aws']).map((s) => s.toUpperCase()),
    bonusSkills: ['System Design', 'CI/CD Pipelines', 'Unit Testing (Jest/JUnit)'],
    keyRoleResponsibilities: [
      'Develop scalable, maintainable application code in production environments.',
      'Collaborate with cross-functional teams to diagnose bugs and optimize database queries.',
      'Participate in agile sprints, peer code reviews, and automated testing.',
    ],
    recommendedPrepPlan: missingSkills.slice(0, 3).map((s) => ({
      skill: s.toUpperCase(),
      importance: 'High' as const,
      actionItem: `Build a mini hands-on demo project utilizing ${s.toUpperCase()} and add it to GitHub.`,
      estimatedDays: 4,
    })),
    predictedInterviewQuestions: [
      `How would you design a database schema for high-read throughput matching the requirements in this JD?`,
      `Explain your experience working with ${(matchingSkills[0] || 'your core language').toUpperCase()} in real projects.`,
      `How do you handle error states and network latency in distributed API calls?`,
    ],
  };
}

function getCuratedInterviewQuestions(subject: string, difficulty: string, count: number) {
  const bank: Record<string, Array<{ question: string; context: string; hint: string; keyConcepts: string[]; expectedAnswerOutline: string; sampleCodeSnippet: string }>> = {
    DSA: [
      {
        question: 'How do you detect a cycle in a Singly Linked List, and what is the optimal Time and Space complexity?',
        context: 'Frequently asked in initial technical screening rounds (Amazon, Microsoft, TCS Digital).',
        hint: "Consider two pointers moving at different speeds (Floyd's Tortoise and Hare algorithm).",
        keyConcepts: ['Two Pointers', 'Slow & Fast Pointers', 'Cycle Detection', 'O(1) Auxiliary Space'],
        expectedAnswerOutline: 'Explain setting slow = head and fast = head. Advance slow by 1 step, fast by 2 steps. If slow == fast, a cycle exists. If fast reaches null, list is acyclic. Time: O(N), Space: O(1).',
        sampleCodeSnippet: `bool hasCycle(ListNode *head) {\n  ListNode *slow = head, *fast = head;\n  while (fast && fast->next) {\n    slow = slow->next;\n    fast = fast->next->next;\n    if (slow == fast) return true;\n  }\n  return false;\n}`,
      },
      {
        question: 'Explain the working of Binary Search on Answer space with a real interview example.',
        context: 'Crucial for passing Tier-1 company online assessments and technical rounds.',
        hint: 'Identify a monotonic condition where if a value k is valid, all values > k (or < k) are also valid/invalid.',
        keyConcepts: ['Monotonic Predicate', 'Search Space Bounds', 'O(log(Range) * Check) Complexity'],
        expectedAnswerOutline: 'Define low = min possible answer, high = max possible answer. Implement a boolean canSatisfy(mid) check function. Bisect the range.',
        sampleCodeSnippet: `int low = minVal, high = maxVal, ans = -1;\nwhile (low <= high) {\n  int mid = low + (high - low) / 2;\n  if (isValid(mid)) { ans = mid; high = mid - 1; }\n  else { low = mid + 1; }\n}`,
      },
      {
        question: 'What is the difference between BFS and DFS for Graph Traversal, and when should you choose which?',
        context: 'Fundamental concept for solving pathfinding, shortest path, and topological ordering problems.',
        hint: 'Think about queue vs stack/recursion, and unweighted shortest path properties.',
        keyConcepts: ['Queue vs Stack', 'Shortest Path in Unweighted Graphs', 'Cycle Detection', 'Recursion Depth'],
        expectedAnswerOutline: 'BFS uses a FIFO Queue and explores level-by-level, optimal for shortest paths in unweighted graphs. DFS uses LIFO/Recursion, exploring deepest branches first, ideal for topological sort, backtracking, and cycle detection.',
        sampleCodeSnippet: `// BFS: Queue-based level exploration\nqueue<int> q; q.push(start); visited[start] = true;`,
      },
    ],
    DBMS: [
      {
        question: 'Explain ACID properties in DBMS with real banking transaction examples.',
        context: 'Standard viva and placement question asked in 90% of campus interviews.',
        hint: 'Atomicity (all or nothing), Consistency (rules preserved), Isolation (no concurrent dirty reads), Durability (written to disk).',
        keyConcepts: ['Transaction Lifecycle', 'WAL (Write-Ahead Logging)', 'Isolation Levels', 'Rollback'],
        expectedAnswerOutline: 'Atomicity: If debit succeeds but credit fails, entire transaction rolls back. Consistency: Total bank balance remains constant. Isolation: Two users debiting same account simultaneously cannot overdraft. Durability: Once committed, committed changes survive power failure.',
        sampleCodeSnippet: `START TRANSACTION;\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nUPDATE accounts SET balance = balance + 100 WHERE id = 2;\nCOMMIT;`,
      },
      {
        question: 'What is Database Normalization? Compare 1NF, 2NF, 3NF, and BCNF.',
        context: 'Tests your understanding of schema design, data redundancy, and update anomalies.',
        hint: 'Focus on atomic values (1NF), removing partial dependency (2NF), and removing transitive dependency (3NF).',
        keyConcepts: ['Update Anomalies', 'Functional Dependency', 'Candidate Keys', 'Transitive Dependency'],
        expectedAnswerOutline: '1NF requires atomic values in columns. 2NF is in 1NF and removes partial functional dependencies (all non-key attributes fully dependent on primary key). 3NF is in 2NF and removes transitive dependencies. BCNF requires that for every X -> Y, X must be a super key.',
        sampleCodeSnippet: `-- 3NF separates Students, Courses, and Instructors into independent tables with foreign keys`,
      },
    ],
    OS: [
      {
        question: 'What is the fundamental difference between a Process and a Thread? How do they share memory?',
        context: 'Classic core OS question asked in technical and viva evaluations.',
        hint: 'A process is an executing program instance with independent address space; threads share code, data, and heap but have their own stack.',
        keyConcepts: ['PCB vs TCB', 'Shared Heap', 'Independent Stack & Registers', 'Context Switch Overhead'],
        expectedAnswerOutline: 'Processes have isolated memory spaces (PCB). Threads belong to a process, sharing code, data, open files, and heap, but each thread has its own stack and program counter. Thread context switching is significantly faster than process switching.',
        sampleCodeSnippet: `// Threads share static & heap memory, requiring mutex/synchronization to avoid race conditions`,
      },
      {
        question: 'What are the 4 necessary conditions for Deadlock, and how can deadlock be prevented?',
        context: 'Coffman conditions are a staple in placement technical rounds.',
        hint: 'Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait.',
        keyConcepts: ["Coffman's Conditions", "Banker's Algorithm", 'Resource Ordering', 'Preemption'],
        expectedAnswerOutline: 'State Mutual Exclusion, Hold & Wait, No Preemption, and Circular Wait. Explain prevention by breaking any one condition (e.g., imposing total resource ordering eliminates Circular Wait).',
        sampleCodeSnippet: `// Impose global hierarchy on resource IDs: always acquire lock(A) before lock(B)`,
      },
    ],
    SQL: [
      {
        question: 'How do you find the N-th highest salary from an Employee table using Window Functions and Subqueries?',
        context: 'Universal SQL interview test query.',
        hint: 'Consider DENSE_RANK() over (ORDER BY salary DESC) or LIMIT / OFFSET.',
        keyConcepts: ['DENSE_RANK vs RANK', 'Window Functions', 'Subquery vs CTE'],
        expectedAnswerOutline: 'Explain that DENSE_RANK() does not skip rank numbers when duplicate salaries exist, whereas RANK() does.',
        sampleCodeSnippet: `WITH RankedSalaries AS (\n  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) as rnk\n  FROM Employee\n)\nSELECT DISTINCT salary FROM RankedSalaries WHERE rnk = 2;`,
      },
    ],
    AIML: [
      {
        question: 'Explain the Bias-Variance tradeoff with examples. How do you diagnose high bias vs high variance?',
        context: 'Core machine learning theory question.',
        hint: 'High bias = Underfitting (model too simple). High variance = Overfitting (model captures noise).',
        keyConcepts: ['Underfitting', 'Overfitting', 'Regularization (L1/L2)', 'Cross-Validation'],
        expectedAnswerOutline: 'High bias results from assumptions making the model too rigid (e.g. linear model on complex curve), causing high training error. High variance results from high sensitivity to small fluctuations, causing low training error but high test error.',
        sampleCodeSnippet: `# Fix high variance: Increase training data, add L2 Ridge regularization, reduce model complexity`,
      },
    ],
  };

  const selectedBank = bank[subject] || bank['DSA'];
  return selectedBank.slice(0, count).map((item, idx) => ({
    id: `q-${subject.toLowerCase()}-${difficulty.toLowerCase()}-${idx + 1}`,
    subject,
    difficulty,
    ...item,
  }));
}

function evaluateAnswerRuleBased(question: string, answer: string, subject: string) {
  const len = answer.trim().split(/\s+/).length;
  let score = 6;
  const lower = answer.toLowerCase();

  const keywordsPresent = [];
  const testKeywords = ['complexity', 'time', 'space', 'pointer', 'memory', 'algorithm', 'table', 'index', 'process', 'thread', 'stack', 'queue', 'optimal'];
  for (const kw of testKeywords) {
    if (lower.includes(kw)) keywordsPresent.push(kw);
  }

  if (len > 35) score += 2;
  if (keywordsPresent.length >= 3) score += 1;
  score = Math.min(10, Math.max(4, score));

  return {
    score,
    verdict: score >= 8 ? 'Excellent' : score >= 6 ? 'Good - Minor Gaps' : 'Needs Revision',
    correctnessFeedback: `Your response shows clear understanding of the core concept. ${len > 25 ? 'You provided good contextual detail.' : 'Consider expanding with step-by-step reasoning.'}`,
    clarityFeedback: 'Clear explanation structure. In live interviews, start with a 1-sentence executive summary before diving into technical mechanics.',
    keyConceptsCovered: keywordsPresent.length > 0 ? keywordsPresent.map((k) => k.toUpperCase()) : ['CORE LOGIC', 'BASIC DEFINITION'],
    keyPointsMissed: ['Mention edge cases (e.g., null inputs, empty structures)', 'Explicitly state Time & Space Complexity upfront (Big-O)'],
    modelAnswer: `For "${question}": State the primary mechanism directly, explain the algorithm/rule, state the Big-O Time & Auxiliary Space complexity, and provide one practical edge-case caveat.`,
    tipsForLiveInterview: 'Always ask clarifying questions about constraints before committing to an algorithm.',
  };
}

function enhanceProjectFallback(title: string, problem: string, tech: any, raw: string, outcome: string) {
  const techStr = Array.isArray(tech) ? tech.join(', ') : tech || 'Modern Tech Stack';
  return {
    resumeBulletPoints: [
      `Architected ${title || 'Distributed Application'} leveraging ${techStr} to address ${problem || 'critical user workflow inefficiencies'}.`,
      `Engineered end-to-end RESTful pipeline with robust error boundary handling, ensuring under 150ms average response latency.`,
      `Deployed production-ready deployment with automated unit verification; achieved ${outcome || 'measurable 40% improvement in task completion speed'}.`,
    ],
    oneLineSummary: `${title || 'Engineering Project'}: High-performance system built with ${techStr} delivering ${outcome || 'efficient data processing and clean user experience'}.`,
    vivaTalkingPoints: [
      `Why ${techStr}? Explain why this tech stack was chosen over alternatives (e.g., speed, ecosystem, concurrency).`,
      `What was the hardest bug encountered? Discuss memory leaks, async concurrency, or schema design tradeoffs.`,
      `How would you scale this to 100,000 active concurrent users? (Discuss Redis caching, load balancers, DB indexing).`,
    ],
    suggestedMetrics: [
      'Latency reduction (e.g., 200ms -> 60ms via indexing)',
      'Concurrent users handled (e.g., 500+ simulated users)',
      'Storage reduction or throughput speedup',
    ],
    githubReadmeSnippet: `### 🚀 ${title || 'Project Overview'}\n\n**Problem Statement:** ${problem || 'Automates manual student placement preparation.'}\n\n**Tech Stack:** ${techStr}\n\n**Key Features:**\n- Real-time performance optimization\n- Responsive mobile & desktop interface\n- Production architecture with comprehensive error boundaries`,
  };
}

// -------------------------------------------------------------
// VITE DEV SERVER & STATIC ASSETS HANDLER
// -------------------------------------------------------------
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('[CareerPilot AI] Vite middleware mounted in development mode');
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('[CareerPilot AI] Serving production static assets from dist/');
  }

  app.listen(PORT, () => {
    console.log(`[CareerPilot AI] Server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[CareerPilot AI] Failed to start server:', err);
  process.exit(1);
});
