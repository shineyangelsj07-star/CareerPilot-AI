import {
  StudentProfile,
  RoadmapData,
  CodingProblem,
  ProjectItem,
} from '../types';

const STORAGE_KEYS = {
  PROFILE: 'careerpilot_profile',
  ROADMAP: 'careerpilot_roadmap',
  COMPLETED_TOPICS: 'careerpilot_completed_topics',
  PROBLEMS: 'careerpilot_problems',
  PROJECTS: 'careerpilot_projects',
  MOCK_HISTORY: 'careerpilot_mock_history',
  VIEW_MODE: 'careerpilot_view_mode', // 'mobile' | 'expanded'
};

export const DEFAULT_PROFILE: StudentProfile = {
  name: 'Arjun Sharma',
  college: 'National Institute of Engineering',
  branch: 'Computer Science & AI (CSE-AIML)',
  yearOfStudy: '3rd Year',
  targetRole: 'Software Development Engineer (SDE)',
  technicalSkills: ['C++', 'Python', 'Data Structures & Algorithms', 'SQL', 'DBMS', 'React', 'Git'],
  dailyStudyHours: 3,
  currentProficiency: 'Intermediate',
  githubUrl: 'https://github.com/arjun-sharma-cse',
  linkedinUrl: 'https://linkedin.com/in/arjun-placement-ready',
  streakDays: 7,
  lastActiveDate: new Date().toISOString().split('T')[0],
  isOnboarded: true,
};

export const INITIAL_PROBLEMS: CodingProblem[] = [
  {
    id: 'prob-1',
    title: 'Two Sum',
    platform: 'LeetCode',
    difficulty: 'Easy',
    topic: 'Arrays & Hashing',
    language: 'C++',
    solvedDate: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    notes: 'Used unordered_map to store complement and index for 1-pass lookups.',
  },
  {
    id: 'prob-2',
    title: 'Longest Substring Without Repeating Characters',
    platform: 'LeetCode',
    difficulty: 'Medium',
    topic: 'Sliding Window',
    language: 'Python',
    solvedDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(min(M, N))',
    notes: 'Classic variable size sliding window with last index hash table.',
  },
  {
    id: 'prob-3',
    title: 'Course Schedule (Cycle in Directed Graph)',
    platform: 'LeetCode',
    difficulty: 'Medium',
    topic: 'Graphs & Topological Sort',
    language: 'C++',
    solvedDate: new Date().toISOString().split('T')[0],
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V + E)',
    notes: "Kahn's algorithm using in-degree array and queue. Cycle detected if visited count < V.",
  },
  {
    id: 'prob-4',
    title: 'Department Highest Salary',
    platform: 'LeetCode',
    difficulty: 'Medium',
    topic: 'SQL Window Functions',
    language: 'SQL',
    solvedDate: new Date().toISOString().split('T')[0],
    timeComplexity: 'O(N log N)',
    spaceComplexity: 'O(N)',
    notes: 'DENSE_RANK() OVER (PARTITION BY departmentId ORDER BY salary DESC).',
  },
];

export const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-1',
    title: 'Smart Health Monitoring & Predictive Triage',
    problemStatement: 'Emergency hospital wards experience 45-minute patient triage bottlenecks due to manual vital recording.',
    technologies: ['Python', 'Scikit-Learn', 'FastAPI', 'React', 'MongoDB'],
    roughDescription: 'Built machine learning classifier using Random Forest on MIMIC patient dataset to prioritize critical ICU arrivals.',
    outcome: 'Achieved 94.2% triage sensitivity and cut patient intake classification wait time by 40%.',
    githubUrl: 'https://github.com/arjun-sharma-cse/smart-health-triage',
    starBullets: [
      'Architected end-to-end triage prediction microservice in FastAPI & Python, evaluating 12 real-time physiological metrics.',
      'Trained Random Forest ensemble model on 15,000+ patient records, achieving 94.2% ROC-AUC for high-risk triage detection.',
      'Constructed responsive React dashboard with WebSocket alerts, reducing nurse manual vitals entry turnaround by 40%.',
    ],
    improvedSummary: 'Smart Health Triage: High-throughput patient acuity prediction platform built with Python & FastAPI cutting emergency department wait times by 40%.',
    vivaTalkingPoints: [
      'Why Random Forest over Deep Learning? Random Forest provides high interpretability (Gini importance) required in clinical settings without needing massive GPU infrastructure.',
      'How did you tackle class imbalance? Implemented SMOTE (Synthetic Minority Over-sampling) on critical emergency cases.',
      'Discuss API latency: Maintained p99 latency under 65ms using async endpoints and Redis query caching.',
    ],
    createdDate: '2026-09-15',
  },
  {
    id: 'proj-2',
    title: 'Distributed In-Memory Key-Value Store with Raft',
    problemStatement: 'Single-node caching stores suffer single point of failure and inconsistency during network partitions.',
    technologies: ['C++', 'gRPC', 'Distributed Systems', 'Docker'],
    roughDescription: 'Implemented leader election, log replication, and heartbeat consensus mechanism following the Raft consensus protocol.',
    outcome: 'Handled 10,000 QPS with automatic failover in under 250ms across 3 dockerized cluster nodes.',
    githubUrl: 'https://github.com/arjun-sharma-cse/raft-kv-store',
    starBullets: [
      'Engineered fault-tolerant distributed Key-Value store in modern C++ adhering strictly to the Raft consensus algorithm.',
      'Implemented robust Leader Election and Log Compaction protocols over high-efficiency gRPC network primitives.',
      'Benchmarked cluster resilience with Chaos Engineering scripts, achieving sub-250ms leader failover under node partitions.',
    ],
    improvedSummary: 'Raft KV Store: High-availability distributed consensus in-memory database in modern C++ sustaining 10,000 QPS with sub-250ms failover.',
    vivaTalkingPoints: [
      'Explain split-brain prevention: Enforced strict majority quorum (N/2 + 1) before committing any state log entry.',
      'How does log compaction work? Snapshotting memory state to disk and truncating previous log entries up to snapshot index.',
    ],
    createdDate: '2026-10-02',
  },
];

// Profile storage
export function loadProfile(): StudentProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) return DEFAULT_PROFILE;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: StudentProfile): void {
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
}

// Completed topics
export function loadCompletedTopics(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COMPLETED_TOPICS);
    return raw ? JSON.parse(raw) : ['w1-t1', 'w1-t2'];
  } catch {
    return ['w1-t1', 'w1-t2'];
  }
}

export function saveCompletedTopics(topics: string[]): void {
  localStorage.setItem(STORAGE_KEYS.COMPLETED_TOPICS, JSON.stringify(topics));
}

// Roadmap
export function loadSavedRoadmap(): RoadmapData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ROADMAP);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveRoadmap(data: RoadmapData): void {
  localStorage.setItem(STORAGE_KEYS.ROADMAP, JSON.stringify(data));
}

// Coding problems
export function loadProblems(): CodingProblem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROBLEMS);
    return raw ? JSON.parse(raw) : INITIAL_PROBLEMS;
  } catch {
    return INITIAL_PROBLEMS;
  }
}

export function saveProblems(problems: CodingProblem[]): void {
  localStorage.setItem(STORAGE_KEYS.PROBLEMS, JSON.stringify(problems));
}

// Projects
export function loadProjects(): ProjectItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return raw ? JSON.parse(raw) : INITIAL_PROJECTS;
  } catch {
    return INITIAL_PROJECTS;
  }
}

export function saveProjects(projects: ProjectItem[]): void {
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
}

// View mode
export function loadViewMode(): 'mobile' | 'expanded' {
  try {
    return (localStorage.getItem(STORAGE_KEYS.VIEW_MODE) as 'mobile' | 'expanded') || 'mobile';
  } catch {
    return 'mobile';
  }
}

export function saveViewMode(mode: 'mobile' | 'expanded'): void {
  localStorage.setItem(STORAGE_KEYS.VIEW_MODE, mode);
}

// Reset all demo data
export function resetDemoData(): void {
  localStorage.removeItem(STORAGE_KEYS.PROFILE);
  localStorage.removeItem(STORAGE_KEYS.ROADMAP);
  localStorage.removeItem(STORAGE_KEYS.COMPLETED_TOPICS);
  localStorage.removeItem(STORAGE_KEYS.PROBLEMS);
  localStorage.removeItem(STORAGE_KEYS.PROJECTS);
  localStorage.removeItem(STORAGE_KEYS.MOCK_HISTORY);
}
