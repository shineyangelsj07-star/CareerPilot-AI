import {
  RoadmapData,
  ResumeAnalysisResult,
  JdMatchResult,
  InterviewQuestion,
  AnswerEvaluation,
} from '../types';

export interface ApiStatus {
  status: string;
  hasGemini: boolean;
  model: string;
  appName: string;
}

export async function fetchApiStatus(): Promise<ApiStatus> {
  try {
    const res = await fetch('/api/status');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API status fetch failed, running in fallback mode', err);
    return {
      status: 'offline',
      hasGemini: false,
      model: 'local-curated',
      appName: 'CareerPilot AI – Smart Placement Assistant',
    };
  }
}

export async function generateRoadmapApi(params: {
  name: string;
  branch: string;
  yearOfStudy: string;
  targetRole: string;
  technicalSkills: string[];
  dailyStudyHours: number;
  currentProficiency: string;
}): Promise<RoadmapData> {
  const res = await fetch('/api/roadmap/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('Failed to generate roadmap from server');
  return await res.json();
}

export async function analyzeResumeApi(params: {
  resumeText: string;
  targetRole: string;
  targetCompanyType?: string;
}): Promise<ResumeAnalysisResult> {
  const res = await fetch('/api/resume/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to analyze resume');
  }
  return await res.json();
}

export async function matchJdApi(params: {
  jobDescription: string;
  userSkills: string[];
  resumeText?: string;
  targetRole?: string;
}): Promise<JdMatchResult> {
  const res = await fetch('/api/jd/match', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to match job description');
  }
  return await res.json();
}

export async function generateInterviewQuestionsApi(params: {
  subject: string;
  difficulty: string;
  count?: number;
}): Promise<{ questions: InterviewQuestion[]; isAiGenerated: boolean }> {
  const res = await fetch('/api/interview/generate-questions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('Failed to fetch interview questions');
  return await res.json();
}

export async function evaluateAnswerApi(params: {
  question: string;
  subject: string;
  studentAnswer: string;
  difficulty?: string;
}): Promise<AnswerEvaluation> {
  const res = await fetch('/api/interview/evaluate-answer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to evaluate answer');
  }
  return await res.json();
}

export async function enhanceProjectApi(params: {
  title: string;
  problemStatement: string;
  technologies: string[];
  roughDescription: string;
  outcome: string;
}): Promise<{
  resumeBulletPoints: string[];
  oneLineSummary: string;
  vivaTalkingPoints: string[];
  suggestedMetrics: string[];
  githubReadmeSnippet: string;
  isAiGenerated: boolean;
}> {
  const res = await fetch('/api/project/enhance-description', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('Failed to enhance project description');
  return await res.json();
}
