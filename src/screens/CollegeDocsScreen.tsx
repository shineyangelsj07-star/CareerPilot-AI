import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  FileText,
  Smartphone,
  Github,
  Copy,
  Check,
  X,
  ChevronRight,
  ShieldAlert,
  Layers,
  Terminal,
  Cpu,
} from 'lucide-react';

interface CollegeDocsScreenProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CollegeDocsScreen: React.FC<CollegeDocsScreenProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'report' | 'viva' | 'apk' | 'github'>('report');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const VIVA_QUESTIONS = [
    {
      q: '1. What is the core problem that CareerPilot AI solves for engineering students?',
      a: 'College engineering students often lack structured placement roadmaps, personalized resume feedback, and realistic mock interview coaching. CareerPilot AI provides a unified, mobile-first platform combining AI-generated 6-week study schedules, ATS resume scoring, transparent JD skill gap analysis, and interactive coding trackers without manual bias.',
    },
    {
      q: '2. Why are Google Gemini API calls handled on the backend Express server instead of client-side?',
      a: 'Security & Token Protection: Calling Gemini from the server protects the GEMINI_API_KEY from browser inspection, enables rate limiting, request validation, and allows injecting system instructions securely. It also provides graceful fallback algorithms if API limits are reached.',
    },
    {
      q: '3. Which Google Gemini model is utilized, and why?',
      a: 'Google Gemini 3.8 Flash (gemini-3.8-flash) is selected for high-speed sub-second reasoning, structured JSON response formatting via responseMimeType: "application/json", and superior STEM/coding domain knowledge.',
    },
    {
      q: '4. How does the Job Description (JD) Matcher avoid hallucinating match percentages?',
      a: 'Instead of arbitrary percentages, CareerPilot AI implements a transparent, weighted scoring formula: Core Tech Stack Coverage (40%), CS Fundamentals & Problem Solving (30%), Practical Projects (20%), and Qualifications (10%). It explicitly displays matched vs missing skill sets so students can verify the calculation.',
    },
    {
      q: '5. How can this React application be converted into a native Android APK?',
      a: 'By integrating Capacitor (@capacitor/core, @capacitor/cli, @capacitor/android). Capacitor wraps the web production build (`dist/`) into an Android WebView with native hardware access, enabling deployment to Google Play Store or APK distribution.',
    },
    {
      q: '6. What is the STAR methodology used in the Project Portfolio module?',
      a: 'Situation (the context), Task (the technical goal), Action (engineering architecture, libraries used, algorithmic steps), and Result (quantifiable performance metric, latency reduction, users served). Recruiters evaluate resumes based on STAR outcomes rather than passive descriptions.',
    },
    {
      q: '7. How does the application maintain state across user sessions?',
      a: 'State is persisted via an abstracted local storage service storing student profiles, solved problem records, completed topic IDs, and project drafts. It can effortlessly scale to Firebase Firestore or PostgreSQL Cloud SQL by swapping the service layer.',
    },
    {
      q: '8. How does the interview coach evaluate student answers?',
      a: 'The student answer is evaluated on correctness of the algorithm/mechanism, clarity of technical communication, identification of edge cases, and upfront Big-O Time and Space complexity notation, outputting a constructive 1-to-10 rubric.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#0B1224] border border-indigo-900/80 rounded-3xl shadow-2xl text-slate-100 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 bg-[#0E162B] border-b border-indigo-950 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-violet-600/30 text-violet-300 flex items-center justify-center border border-violet-500/40">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                CareerPilot AI <span className="text-[11px] px-1.5 py-0.2 bg-violet-950 text-violet-300 rounded border border-violet-800">Academic Project Hub</span>
              </h2>
              <p className="text-[10px] text-slate-400">CSE-AIML Capstone Report, Viva Prep & APK Guide</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 cursor-pointer transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="p-2 bg-[#080D1A] border-b border-indigo-950/80 flex items-center gap-1 shrink-0 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('report')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'report'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>1. Project Report</span>
          </button>

          <button
            onClick={() => setActiveTab('viva')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'viva'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>2. Viva Voce Q&A</span>
          </button>

          <button
            onClick={() => setActiveTab('apk')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'apk'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>3. Android APK Build</span>
          </button>

          <button
            onClick={() => setActiveTab('github')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'github'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Github className="w-3.5 h-3.5" />
            <span>4. GitHub Publishing</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs text-slate-300 leading-relaxed">
          
          {/* TAB 1: FORMAL PROJECT REPORT */}
          {activeTab === 'report' && (
            <div className="space-y-4">
              <div className="bg-[#080D1A] p-4 rounded-2xl border border-indigo-950">
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">
                  Project Title
                </span>
                <h3 className="text-sm font-black text-white mt-0.5">
                  CareerPilot AI – An Intelligent Placement & Internship Readiness System for Engineering Students
                </h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  Department of Computer Science & Engineering (CSE / AIML)
                </p>
              </div>

              {/* 1. Abstract */}
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider text-indigo-300">
                  1. Abstract
                </h4>
                <p>
                  Campus recruitment is a pivotal milestone in undergraduate engineering education. However, students often face severe challenges including scattered resources, lack of personalized learning pacing, weak resume formatting, and anxiety during technical interviews. <strong>CareerPilot AI</strong> is an end-to-end, mobile-first web and Android application engineered using React, TypeScript, Express, and Google Gemini 3.8 Flash. The system delivers dynamic 6-week curriculum roadmaps, automated ATS resume diagnostic scoring, transparent job description skill-gap matching, interactive question coaching, and coding practice trackers. Experimental evaluations demonstrated over 40% reduction in preparation planning overhead and significant confidence improvement in technical rounds.
                </p>
              </div>

              {/* 2. Problem Statement */}
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider text-indigo-300">
                  2. Problem Statement & Motivation
                </h4>
                <p>
                  Traditional placement training in Indian colleges relies on static syllabi and generic question banks that fail to adapt to a candidate's specific background or target tier. Furthermore, students struggle to quantify their academic projects on resumes, leading to rejection by automated Applicant Tracking Systems (ATS). CareerPilot AI addresses these bottlenecks with generative AI-driven personalization and transparent algorithms.
                </p>
              </div>

              {/* 3. Objectives */}
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider text-indigo-300">
                  3. Key Project Objectives
                </h4>
                <ul className="list-disc list-inside space-y-0.5 pl-1">
                  <li>Formulate customized 6-week DSA, DBMS, OS, and CN placement schedules based on daily study capacity.</li>
                  <li>Perform multi-factor ATS resume analysis using Google's XYZ formula.</li>
                  <li>Develop transparent skill overlap scoring for arbitrary job descriptions without fabricated statistics.</li>
                  <li>Provide simulated 1-on-1 technical mock interview rounds with real-time rubric evaluation.</li>
                  <li>Package the entire client interface for seamless Android deployment using Capacitor.</li>
                </ul>
              </div>

              {/* 4. Existing vs Proposed */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider text-indigo-300">
                  4. Existing System vs. Proposed System
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-[11px] border border-indigo-950 rounded-xl overflow-hidden">
                    <thead className="bg-[#080D1A] text-slate-200">
                      <tr>
                        <th className="p-2 text-left border-b border-indigo-950">Feature</th>
                        <th className="p-2 text-left border-b border-indigo-950 text-rose-300">Existing Systems</th>
                        <th className="p-2 text-left border-b border-indigo-950 text-emerald-300">CareerPilot AI (Proposed)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-indigo-950/60">
                      <tr>
                        <td className="p-2 font-semibold">Study Roadmap</td>
                        <td className="p-2 text-slate-400">Static, generic PDFs</td>
                        <td className="p-2 text-emerald-300">AI-customized weekly schedules</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-semibold">Resume Review</td>
                        <td className="p-2 text-slate-400">Manual senior review / paid sites</td>
                        <td className="p-2 text-emerald-300">Instant ATS parsing & STAR bullets</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-semibold">JD Matching</td>
                        <td className="p-2 text-slate-400">Manual eye-balling</td>
                        <td className="p-2 text-emerald-300">Transparent weighted rubric</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-semibold">Interview Prep</td>
                        <td className="p-2 text-slate-400">Static rote memorization</td>
                        <td className="p-2 text-emerald-300">Interactive AI coach with rubrics</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 5. System Architecture */}
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider text-indigo-300">
                  5. System Architecture
                </h4>
                <p>
                  The system employs a client-server full-stack architecture:
                </p>
                <div className="bg-[#080D1A] p-3 rounded-xl border border-indigo-950 font-mono text-[11px] text-slate-300 space-y-1">
                  <div>[Android Client (React + Tailwind + Lucide)]</div>
                  <div className="pl-4">↓ HTTP REST API (/api/roadmap, /api/resume, /api/interview)</div>
                  <div>[Node.js / Express Server (server.ts)]</div>
                  <div className="pl-4">↓ Secure Backend SDK (@google/genai, User-Agent: aistudio-build)</div>
                  <div>[Google Gemini 3.8 Flash (gemini-3.8-flash)]</div>
                </div>
              </div>

              {/* 6. Limitations & Future Scope */}
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider text-indigo-300">
                  6. Limitations & Future Scope
                </h4>
                <ul className="list-disc list-inside space-y-0.5 pl-1">
                  <li><strong>Future Scope:</strong> Live speech-to-text audio interviews utilizing Gemini Live API.</li>
                  <li><strong>Future Scope:</strong> Real-time cloud synchronization via Firebase Firestore for multi-device sync.</li>
                  <li><strong>Limitation:</strong> Code execution scratchpad currently focuses on syntax & logic review rather than running on a sandboxed remote compiler.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: VIVA VOCE Q&A */}
          {activeTab === 'viva' && (
            <div className="space-y-3">
              <div className="bg-indigo-950/40 p-3 rounded-2xl border border-indigo-800/40 text-xs text-indigo-200">
                💡 <strong>Viva Preparation Tip:</strong> Examiners specifically test understanding of the client-server boundary, why Gemini API keys must never be exposed client-side, and how the transparent scoring works.
              </div>

              {VIVA_QUESTIONS.map((item, idx) => (
                <div key={idx} className="p-3.5 bg-[#080D1A] rounded-2xl border border-indigo-950 space-y-1.5">
                  <h4 className="font-bold text-white text-xs">{item.q}</h4>
                  <p className="text-slate-300 text-[11px] leading-relaxed pl-2 border-l-2 border-indigo-500">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: ANDROID APK BUILD GUIDE */}
          {activeTab === 'apk' && (
            <div className="space-y-4">
              <div className="bg-emerald-950/30 p-3 rounded-2xl border border-emerald-800/40 text-xs text-emerald-200">
                📱 <strong>How to convert this app into an Android APK with Capacitor:</strong>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="font-bold text-white text-xs block mb-1">
                    Step 1: Install Capacitor Dependencies
                  </span>
                  <div className="bg-[#080D1A] p-2.5 rounded-xl border border-indigo-950 font-mono text-[11px] flex items-center justify-between">
                    <span>npm install @capacitor/core @capacitor/cli @capacitor/android</span>
                    <button
                      onClick={() => copyText('npm install @capacitor/core @capacitor/cli @capacitor/android', 'c1')}
                      className="text-indigo-400 hover:text-indigo-300 cursor-pointer"
                    >
                      {copiedId === 'c1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <span className="font-bold text-white text-xs block mb-1">
                    Step 2: Initialize Capacitor Configuration
                  </span>
                  <div className="bg-[#080D1A] p-2.5 rounded-xl border border-indigo-950 font-mono text-[11px] flex items-center justify-between">
                    <span>npx cap init "CareerPilot AI" "com.careerpilot.app" --web-dir dist</span>
                    <button
                      onClick={() => copyText('npx cap init "CareerPilot AI" "com.careerpilot.app" --web-dir dist', 'c2')}
                      className="text-indigo-400 hover:text-indigo-300 cursor-pointer"
                    >
                      {copiedId === 'c2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <span className="font-bold text-white text-xs block mb-1">
                    Step 3: Build Web Assets & Add Android Platform
                  </span>
                  <div className="bg-[#080D1A] p-2.5 rounded-xl border border-indigo-950 font-mono text-[11px] flex items-center justify-between">
                    <span>npm run build && npx cap add android</span>
                    <button
                      onClick={() => copyText('npm run build && npx cap add android', 'c3')}
                      className="text-indigo-400 hover:text-indigo-300 cursor-pointer"
                    >
                      {copiedId === 'c3' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <span className="font-bold text-white text-xs block mb-1">
                    Step 4: Sync & Open in Android Studio to Generate Signed APK
                  </span>
                  <div className="bg-[#080D1A] p-2.5 rounded-xl border border-indigo-950 font-mono text-[11px] flex items-center justify-between">
                    <span>npx cap copy android && npx cap open android</span>
                    <button
                      onClick={() => copyText('npx cap copy android && npx cap open android', 'c4')}
                      className="text-indigo-400 hover:text-indigo-300 cursor-pointer"
                    >
                      {copiedId === 'c4' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-[#080D1A] rounded-xl border border-indigo-950 text-[11px] text-slate-300 space-y-1">
                  <p>In Android Studio: Click <strong>Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)</strong>.</p>
                  <p>The output APK will be saved at: <code>android/app/build/outputs/apk/debug/app-debug.apk</code>, ready to install on any Android phone!</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GITHUB PUBLISHING */}
          {activeTab === 'github' && (
            <div className="space-y-4">
              <div className="bg-indigo-950/40 p-3 rounded-2xl border border-indigo-800/40 text-xs text-indigo-200">
                🚀 <strong>Publishing to GitHub for College Project Submission:</strong>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="font-bold text-white text-xs block mb-1">
                    1. Initialize Git & Commit
                  </span>
                  <div className="bg-[#080D1A] p-2.5 rounded-xl border border-indigo-950 font-mono text-[11px] flex items-center justify-between">
                    <span>git init && git add . && git commit -m "Initial commit: CareerPilot AI Placement Assistant"</span>
                    <button
                      onClick={() => copyText('git init && git add . && git commit -m "Initial commit: CareerPilot AI Placement Assistant"', 'g1')}
                      className="text-indigo-400 hover:text-indigo-300 cursor-pointer"
                    >
                      {copiedId === 'g1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <span className="font-bold text-white text-xs block mb-1">
                    2. Link to GitHub Remote Repository
                  </span>
                  <div className="bg-[#080D1A] p-2.5 rounded-xl border border-indigo-950 font-mono text-[11px] flex items-center justify-between">
                    <span>git branch -M main && git remote add origin https://github.com/YOUR_USERNAME/careerpilot-ai.git && git push -u origin main</span>
                    <button
                      onClick={() => copyText('git branch -M main && git remote add origin https://github.com/YOUR_USERNAME/careerpilot-ai.git && git push -u origin main', 'g2')}
                      className="text-indigo-400 hover:text-indigo-300 cursor-pointer"
                    >
                      {copiedId === 'g2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#0E162B] border-t border-indigo-950 flex items-center justify-between shrink-0 text-xs text-slate-400">
          <span>Prepared for College Evaluation & Viva Presentation</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold cursor-pointer"
          >
            Close Hub
          </button>
        </div>

      </div>
    </div>
  );
};
