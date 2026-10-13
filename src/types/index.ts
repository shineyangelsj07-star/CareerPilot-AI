export type TargetRole =
  | 'Software Development Engineer (SDE)'
  | 'Full Stack Web Developer'
  | 'AI / Machine Learning Engineer'
  | 'Backend Engineer'
  | 'Frontend Engineer'
  | 'Data Analyst / Data Engineer'
  | 'Cloud / DevOps Engineer';

export type YearOfStudy = '1st Year' | '2nd Year' | '3rd Year' | '4th Year / Final Year';

export type ProficiencyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface StudentProfile {
  name: string;
  college: string;
  branch: string;
  yearOfStudy: YearOfStudy;
  targetRole: TargetRole;
  technicalSkills: string[];
  dailyStudyHours: number;
  currentProficiency: ProficiencyLevel;
  githubUrl?: string;
  linkedinUrl?: string;
  streakDays: number;
  lastActiveDate: string;
  isOnboarded: boolean;
}

export interface RoadmapTopic {
  id: string;
  title: string;
  category: 'DSA' | 'DBMS' | 'OS' | 'CN' | 'SQL' | 'TechStack' | 'AIML' | 'Aptitude';
  estimatedHours: number;
  keyConcepts: string[];
  practiceExercise: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  isCompleted?: boolean;
}

export interface RoadmapWeek {
  weekNumber: number;
  theme: string;
  goal: string;
  topics: RoadmapTopic[];
}

export interface RoadmapData {
  roleSummary: string;
  targetRole: string;
  totalWeeks: number;
  weeklyCommitmentHours: number;
  milestones: string[];
  weeks: RoadmapWeek[];
  isAiGenerated?: boolean;
  generatedAt?: string;
}

export interface ResumeSectionScores {
  contactAndSummary: number;
  technicalSkills: number;
  projectImpact: number;
  educationAndAchievements: number;
  atsFormatting: number;
}

export interface ResumeImprovement {
  area: string;
  issue: string;
  recommendation: string;
  exampleFix: string;
}

export interface BulletFix {
  original: string;
  improved: string;
  rationale: string;
}

export interface ResumeAnalysisResult {
  score: number;
  verdict: string;
  sectionScores: ResumeSectionScores;
  detectedSkills: string[];
  missingSkills: string[];
  strengths: string[];
  actionableImprovements: ResumeImprovement[];
  improvedSummary: string;
  bulletFixSuggestions: BulletFix[];
  isAiGenerated?: boolean;
}

export interface JdMatchResult {
  matchScore: number;
  scoreBreakdown: {
    coreTechCoverage: number;
    csFundamentals: number;
    practicalProjects: number;
    qualifications: number;
  };
  matchingSkills: string[];
  missingSkills: string[];
  bonusSkills: string[];
  keyRoleResponsibilities: string[];
  recommendedPrepPlan: Array<{
    skill: string;
    importance: 'High' | 'Medium';
    actionItem: string;
    estimatedDays: number;
  }>;
  predictedInterviewQuestions: string[];
  isAiGenerated?: boolean;
}

export type CodingDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface CodingProblem {
  id: string;
  title: string;
  platform: 'LeetCode' | 'GeeksforGeeks' | 'CodeChef' | 'HackerRank' | 'CodeStudio' | 'Other';
  difficulty: CodingDifficulty;
  topic: string;
  language: 'C++' | 'Java' | 'Python' | 'JavaScript' | 'C' | 'SQL';
  solvedDate: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  notes?: string;
  solutionSnippet?: string;
}

export interface InterviewQuestion {
  id: string;
  subject: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  question: string;
  context: string;
  hint: string;
  keyConcepts: string[];
  expectedAnswerOutline: string;
  sampleCodeSnippet?: string;
}

export interface AnswerEvaluation {
  score: number;
  verdict: string;
  correctnessFeedback: string;
  clarityFeedback: string;
  keyConceptsCovered: string[];
  keyPointsMissed: string[];
  modelAnswer: string;
  tipsForLiveInterview: string;
  isAiGenerated?: boolean;
}

export interface ProjectItem {
  id: string;
  title: string;
  problemStatement: string;
  technologies: string[];
  roughDescription: string;
  outcome: string;
  githubUrl?: string;
  liveDemoUrl?: string;
  starBullets?: string[];
  improvedSummary?: string;
  vivaTalkingPoints?: string[];
  createdDate: string;
}
