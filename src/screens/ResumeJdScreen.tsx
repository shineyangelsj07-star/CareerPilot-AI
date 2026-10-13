import React, { useState } from 'react';
import {
  FileText,
  Briefcase,
  Sparkles,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  TrendingUp,
  Target,
  ArrowRight,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import { StudentProfile, ResumeAnalysisResult, JdMatchResult } from '../types';
import { analyzeResumeApi, matchJdApi } from '../services/api';

interface ResumeJdScreenProps {
  profile: StudentProfile;
  initialMode?: 'resume' | 'jd';
}

const SAMPLE_RESUME = `ARJUN SHARMA
Bengaluru, India | +91 9876543210 | arjun.sharma@example.com | github.com/arjun-sharma-cse | linkedin.com/in/arjun-placement-ready

EDUCATION
National Institute of Engineering — B.Tech Computer Science & AI (CSE-AIML)
CGPA: 8.85 / 10 | Expected Graduation: 2026

TECHNICAL SKILLS
Languages: C++, Python, SQL, JavaScript, HTML/CSS
Core CS: Data Structures & Algorithms, Object-Oriented Programming, DBMS, Operating Systems, Computer Networks
Frameworks & Libraries: React, Node.js, Express, FastAPI, Scikit-Learn, Pandas, NumPy
Developer Tools: Git, GitHub, Docker, Postman, VS Code, Linux

PROJECTS
Smart Health Monitoring & Predictive Triage | Python, FastAPI, React, Scikit-Learn
- Architected end-to-end triage prediction microservice evaluating 12 physiological patient metrics in real time.
- Trained Random Forest ensemble model on 15,000+ patient records, achieving 94.2% ROC-AUC for high-risk triage detection.
- Constructed responsive React dashboard with WebSocket alerts, reducing nurse manual vitals entry turnaround by 40%.

Distributed In-Memory Key-Value Store | C++, gRPC, Docker, Linux
- Engineered fault-tolerant distributed Key-Value store in modern C++ adhering strictly to the Raft consensus algorithm.
- Implemented robust Leader Election and Log Compaction protocols over high-efficiency gRPC network primitives.
- Benchmarked cluster resilience with Chaos Engineering scripts, achieving sub-250ms leader failover under node partitions.

CODING ACHIEVEMENTS
- Solved 250+ algorithmic questions on LeetCode & GeeksforGeeks (Rating: 1680+).
- Qualified Round 2 of TCS CodeVita 2025; finalist at Inter-College Hackathon 2024.`;

const SAMPLE_JD = `Role: Software Development Engineer Intern (Campus 2026)
Company: CloudScale Technologies

About the Role:
We are seeking high-caliber engineering interns passionate about distributed systems and cloud services. You will design, build, and optimize backend microservices and high-throughput data processing pipelines.

Basic Qualifications:
- Currently pursuing a Bachelor's degree in Computer Science, AIML, IT, or related STEM field.
- Proficiency in at least one modern language: C++, Java, or Python.
- Strong grasp of Data Structures, Algorithms, Time/Space Complexity analysis.
- Understanding of Relational Databases (SQL) and ACID transaction guarantees.
- Hands-on experience with version control (Git) and RESTful API architecture.

Preferred Qualifications:
- Knowledge of Docker containerization and cloud platforms (AWS / GCP).
- Experience with concurrency, multithreading, or message queues (Kafka / RabbitMQ).
- Passion for writing clean, modular, and unit-tested software.`;

export const ResumeJdScreen: React.FC<ResumeJdScreenProps> = ({
  profile,
  initialMode = 'resume',
}) => {
  const [activeTab, setActiveTab] = useState<'resume' | 'jd'>(initialMode);

  // Resume State
  const [resumeText, setResumeText] = useState(SAMPLE_RESUME);
  const [isAnalyzingResume, setIsAnalyzingResume] = useState(false);
  const [resumeResult, setResumeResult] = useState<ResumeAnalysisResult | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [resumeError, setResumeError] = useState('');

  // JD State
  const [jdText, setJdText] = useState(SAMPLE_JD);
  const [isMatchingJd, setIsMatchingJd] = useState(false);
  const [jdResult, setJdResult] = useState<JdMatchResult | null>(null);
  const [jdError, setJdError] = useState('');

  // File Upload Handler (.txt)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setResumeText(content);
      }
    };
    reader.readAsText(file);
  };

  const handleAnalyzeResume = async () => {
    if (!resumeText.trim() || resumeText.trim().length < 40) {
      setResumeError('Please paste your resume text (at least 40 characters) or upload a file.');
      return;
    }

    setIsAnalyzingResume(true);
    setResumeError('');
    try {
      const result = await analyzeResumeApi({
        resumeText,
        targetRole: profile.targetRole,
        targetCompanyType: 'Product Engineering (Tier 1/Tier 2)',
      });
      setResumeResult(result);
    } catch (err: any) {
      setResumeError(err?.message || 'Could not analyze resume. Please try again.');
    } finally {
      setIsAnalyzingResume(false);
    }
  };

  const handleMatchJd = async () => {
    if (!jdText.trim() || jdText.trim().length < 30) {
      setJdError('Please paste a job or internship description.');
      return;
    }

    setIsMatchingJd(true);
    setJdError('');
    try {
      const result = await matchJdApi({
        jobDescription: jdText,
        userSkills: profile.technicalSkills,
        resumeText,
        targetRole: profile.targetRole,
      });
      setJdResult(result);
    } catch (err: any) {
      setJdError(err?.message || 'Could not match job description. Please try again.');
    } finally {
      setIsMatchingJd(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 text-slate-100 pb-20">
      
      {/* Sub Tabs */}
      <div className="bg-[#0D1527] p-1 rounded-2xl border border-indigo-950 flex items-center gap-1 shadow-sm">
        <button
          onClick={() => setActiveTab('resume')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
            activeTab === 'resume'
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Resume ATS Analyzer</span>
        </button>

        <button
          onClick={() => setActiveTab('jd')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
            activeTab === 'jd'
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>JD Skill Matcher</span>
        </button>
      </div>

      {activeTab === 'resume' ? (
        /* ================= RESUME ANALYZER ================= */
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-[#12182F] via-[#0E1528] to-[#0A0F1E] border border-indigo-900/60 rounded-3xl p-4 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider block mb-1">
                  ATS Optimization Engine
                </span>
                <h3 className="text-base font-extrabold text-white">Campus Resume ATS Scanner</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Benchmarks against Tier-1 Product Recruiters & ATS keyword filters.
                </p>
              </div>

              <label className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-800 text-xs font-semibold cursor-pointer transition">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload .txt</span>
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Resume Input Area */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span>Paste Resume Text or Use College Template</span>
                <button
                  onClick={() => setResumeText(SAMPLE_RESUME)}
                  className="text-indigo-400 hover:underline cursor-pointer"
                >
                  Reset Sample Resume
                </button>
              </div>
              <textarea
                rows={7}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your plain text resume here..."
                className="w-full bg-[#080D1A] border border-indigo-950 rounded-xl p-3 text-xs text-slate-200 font-mono leading-relaxed focus:outline-none focus:border-indigo-500"
              />
            </div>

            {resumeError && (
              <div className="text-rose-400 text-xs bg-rose-950/60 p-2.5 rounded-xl mt-2 border border-rose-800">
                {resumeError}
              </div>
            )}

            <button
              onClick={handleAnalyzeResume}
              disabled={isAnalyzingResume}
              className="mt-3 w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-indigo-200" />
              <span>{isAnalyzingResume ? 'Scanning Resume with ATS Engine...' : 'Run Comprehensive ATS Analysis'}</span>
            </button>
          </div>

          {/* Analysis Results Display */}
          {resumeResult && (
            <div className="bg-[#0D1527] border border-indigo-900/80 rounded-3xl p-5 shadow-2xl space-y-4 animate-fade-in">
              {/* Score Header */}
              <div className="flex items-center justify-between pb-3 border-b border-indigo-950">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">ATS Compatibility Score</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <h4 className="text-3xl font-black text-white">{resumeResult.score}</h4>
                    <span className="text-xs text-slate-400">/ 100</span>
                    <span className="text-xs font-bold text-emerald-400 ml-1">
                      {resumeResult.verdict}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 font-medium">
                    {resumeResult.isAiGenerated ? '✨ Gemini AI Verified' : '🤖 Curated ATS Rubric'}
                  </span>
                </div>
              </div>

              {/* Section Scores Breakdown */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-300 block">Section Breakdown</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-[#080D1A] rounded-xl border border-indigo-950">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Technical Skills</span>
                      <span className="text-indigo-300 font-bold">{resumeResult.sectionScores.technicalSkills} / 25</span>
                    </div>
                  </div>
                  <div className="p-2 bg-[#080D1A] rounded-xl border border-indigo-950">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Project Impact</span>
                      <span className="text-indigo-300 font-bold">{resumeResult.sectionScores.projectImpact} / 30</span>
                    </div>
                  </div>
                  <div className="p-2 bg-[#080D1A] rounded-xl border border-indigo-950">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Contact & Summary</span>
                      <span className="text-indigo-300 font-bold">{resumeResult.sectionScores.contactAndSummary} / 20</span>
                    </div>
                  </div>
                  <div className="p-2 bg-[#080D1A] rounded-xl border border-indigo-950">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>ATS Formatting</span>
                      <span className="text-indigo-300 font-bold">{resumeResult.sectionScores.atsFormatting} / 10</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detected vs Missing Skills */}
              <div className="space-y-2">
                <div>
                  <span className="text-[11px] font-bold text-emerald-400 block mb-1">
                    Detected Technical Keywords ({resumeResult.detectedSkills.length})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {resumeResult.detectedSkills.map((sk, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/40 text-emerald-300 border border-emerald-800"
                      >
                        ✓ {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {resumeResult.missingSkills?.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold text-amber-400 block mb-1">
                      High-Yield Keywords Missing for {profile.targetRole}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {resumeResult.missingSkills.map((sk, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950/40 text-amber-300 border border-amber-800"
                        >
                          + {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actionable Improvements */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-300 block">
                  Actionable Fixes (Google XYZ Formula)
                </span>
                {resumeResult.actionableImprovements.map((imp, i) => (
                  <div key={i} className="p-3 bg-[#080D1A] rounded-xl border border-indigo-950 text-xs space-y-1">
                    <span className="font-bold text-indigo-300 text-[11px] block">{imp.area}</span>
                    <p className="text-slate-400 text-[11px]">{imp.issue}</p>
                    <p className="text-emerald-300 text-[11px] bg-emerald-950/30 p-2 rounded-lg border border-emerald-900/40 mt-1 font-mono">
                      💡 {imp.exampleFix}
                    </p>
                  </div>
                ))}
              </div>

              {/* Improved Resume Summary */}
              {resumeResult.improvedSummary && (
                <div className="bg-[#080D1A] p-3.5 rounded-2xl border border-indigo-950 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-violet-300">
                      Recommended ATS Professional Summary
                    </span>
                    <button
                      onClick={() => copyToClipboard(resumeResult.improvedSummary)}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedSummary ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedSummary ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    "{resumeResult.improvedSummary}"
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* ================= JD SKILL MATCHER ================= */
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-[#12182F] via-[#0E1528] to-[#0A0F1E] border border-indigo-900/60 rounded-3xl p-4 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider block mb-1">
                  Transparent Skill Overlap
                </span>
                <h3 className="text-base font-extrabold text-white">Job Description Matcher</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Compares role requirements with your verified skills and resume.
                </p>
              </div>

              <button
                onClick={() => setJdText(SAMPLE_JD)}
                className="text-[11px] text-indigo-400 hover:underline cursor-pointer"
              >
                Reset Sample JD
              </button>
            </div>

            <div className="mt-3">
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Paste Job or Internship Description
              </label>
              <textarea
                rows={7}
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste the requirements, responsibilities, or job posting..."
                className="w-full bg-[#080D1A] border border-indigo-950 rounded-xl p-3 text-xs text-slate-200 font-mono leading-relaxed focus:outline-none focus:border-indigo-500"
              />
            </div>

            {jdError && (
              <div className="text-rose-400 text-xs bg-rose-950/60 p-2.5 rounded-xl mt-2 border border-rose-800">
                {jdError}
              </div>
            )}

            <button
              onClick={handleMatchJd}
              disabled={isMatchingJd}
              className="mt-3 w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-indigo-600 to-violet-600 hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer disabled:opacity-50"
            >
              <Briefcase className="w-4 h-4 text-emerald-200" />
              <span>{isMatchingJd ? 'Evaluating Skill Overlap...' : 'Calculate Transparent Match Score'}</span>
            </button>
          </div>

          {/* JD Match Results Display */}
          {jdResult && (
            <div className="bg-[#0D1527] border border-indigo-900/80 rounded-3xl p-5 shadow-2xl space-y-4 animate-fade-in">
              {/* Overall Match */}
              <div className="flex items-center justify-between pb-3 border-b border-indigo-950">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Calculated Match Score</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <h4 className="text-3xl font-black text-emerald-400">{jdResult.matchScore}%</h4>
                    <span className="text-xs text-slate-400">Match</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 font-medium">
                    {jdResult.isAiGenerated ? '✨ Gemini Fit Analysis' : '📊 Transparent Overlap Model'}
                  </span>
                </div>
              </div>

              {/* Transparent Score Breakdown */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-300 block">
                  Transparent Scoring Rubric (Non-Fabricated)
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-[#080D1A] rounded-xl border border-indigo-950">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Core Tech Stack</span>
                      <span className="text-emerald-400 font-bold">{jdResult.scoreBreakdown.coreTechCoverage} / 40</span>
                    </div>
                  </div>
                  <div className="p-2 bg-[#080D1A] rounded-xl border border-indigo-950">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>CS Fundamentals</span>
                      <span className="text-indigo-400 font-bold">{jdResult.scoreBreakdown.csFundamentals} / 30</span>
                    </div>
                  </div>
                  <div className="p-2 bg-[#080D1A] rounded-xl border border-indigo-950">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Practical Projects</span>
                      <span className="text-purple-400 font-bold">{jdResult.scoreBreakdown.practicalProjects} / 20</span>
                    </div>
                  </div>
                  <div className="p-2 bg-[#080D1A] rounded-xl border border-indigo-950">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Qualifications</span>
                      <span className="text-amber-400 font-bold">{jdResult.scoreBreakdown.qualifications} / 10</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Matching vs Missing Skills */}
              <div className="space-y-2">
                <div>
                  <span className="text-[11px] font-bold text-emerald-400 block mb-1">
                    Matching Skills Found ({jdResult.matchingSkills.length})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {jdResult.matchingSkills.map((sk, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/40 text-emerald-300 border border-emerald-800"
                      >
                        ✓ {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {jdResult.missingSkills?.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold text-rose-400 block mb-1">
                      Required Skills To Acquire Before Applying
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {jdResult.missingSkills.map((sk, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-rose-950/40 text-rose-300 border border-rose-800"
                        >
                          ✕ {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Recommended Prep Plan */}
              {jdResult.recommendedPrepPlan?.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-300 block">
                    Targeted Bridge Learning Plan
                  </span>
                  {jdResult.recommendedPrepPlan.map((step, i) => (
                    <div key={i} className="p-2.5 bg-[#080D1A] rounded-xl border border-indigo-950 text-xs flex items-start justify-between">
                      <div className="flex-1 pr-2">
                        <span className="font-bold text-white text-[11px] block">{step.skill}</span>
                        <p className="text-slate-400 text-[10px] mt-0.5">{step.actionItem}</p>
                      </div>
                      <span className="text-[10px] text-amber-400 font-mono shrink-0">
                        ~{step.estimatedDays} days
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Predicted Interview Questions */}
              {jdResult.predictedInterviewQuestions?.length > 0 && (
                <div className="space-y-1.5 bg-[#080D1A] p-3 rounded-2xl border border-indigo-950">
                  <span className="text-[11px] font-bold text-indigo-300 block">
                    Predicted Technical Questions for this JD:
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300">
                    {jdResult.predictedInterviewQuestions.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
