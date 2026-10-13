import React from 'react';
import {
  Sparkles,
  Flame,
  CheckCircle2,
  Code2,
  FileText,
  Briefcase,
  MessagesSquare,
  ArrowRight,
  TrendingUp,
  Target,
  GraduationCap,
  Play,
  Award,
} from 'lucide-react';
import { StudentProfile, CodingProblem, RoadmapData } from '../types';
import { ActiveTab } from '../components/Navigation';

interface HomeScreenProps {
  profile: StudentProfile;
  problems: CodingProblem[];
  roadmap: RoadmapData | null;
  completedTopicIds: string[];
  onNavigate: (tab: ActiveTab) => void;
  onOpenCollegeDocs: () => void;
  onOpenResumeATS: () => void;
  onOpenJdMatcher: () => void;
  onToggleTopic: (topicId: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  profile,
  problems,
  roadmap,
  completedTopicIds,
  onNavigate,
  onOpenCollegeDocs,
  onOpenResumeATS,
  onOpenJdMatcher,
  onToggleTopic,
}) => {
  // Compute Placement Readiness Score dynamically
  const solvedCount = problems.length;
  const mediumHardCount = problems.filter((p) => p.difficulty !== 'Easy').length;
  const topicsCompletedCount = completedTopicIds.length;

  // Transparent calculation:
  // Roadmap topics: up to 40 pts
  // Solved problems: up to 35 pts
  // Streak & profile completeness: up to 25 pts
  const roadmapPoints = Math.min(40, topicsCompletedCount * 6);
  const codingPoints = Math.min(35, solvedCount * 5 + mediumHardCount * 3);
  const profilePoints = profile.isOnboarded ? 25 : 10;
  const readinessPercentage = Math.min(96, Math.max(20, roadmapPoints + codingPoints + profilePoints));

  // Determine today's recommended topics from roadmap
  const allTopics = roadmap ? roadmap.weeks.flatMap((w) => w.topics) : [];
  const pendingTopics = allTopics.filter((t) => !completedTopicIds.includes(t.id));
  const todaysTasks = pendingTopics.slice(0, 3);

  // Coding stats breakdown
  const easyCount = problems.filter((p) => p.difficulty === 'Easy').length;
  const mediumCount = problems.filter((p) => p.difficulty === 'Medium').length;
  const hardCount = problems.filter((p) => p.difficulty === 'Hard').length;

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 text-slate-100 pb-20">
      
      {/* 1. Personalized Greeting Banner */}
      <div className="bg-gradient-to-br from-[#131B36] via-[#10172D] to-[#0D1224] border border-indigo-900/60 rounded-3xl p-4.5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-start justify-between relative z-10">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-semibold mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>{profile.college}</span>
            </div>
            <h2 className="text-lg font-black text-white tracking-tight">
              Hey, {profile.name}! 👋
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Targeting <span className="text-indigo-300 font-medium">{profile.targetRole}</span>
            </p>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Prep Streak</span>
            <div className="flex items-center gap-1 text-amber-300 font-extrabold text-base">
              <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span>{profile.streakDays} Days</span>
            </div>
          </div>
        </div>

        {/* Readiness Progress Bar & Score */}
        <div className="mt-4 pt-3 border-t border-indigo-950/70">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-300 font-semibold flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
              Placement Readiness Index
            </span>
            <span className="font-extrabold text-indigo-300">{readinessPercentage}% Ready</span>
          </div>

          <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-indigo-950">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-700 shadow-sm"
              style={{ width: `${readinessPercentage}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5">
            <span>{topicsCompletedCount} Roadmap Topics Mastered</span>
            <span>{solvedCount} Problems Solved</span>
          </div>
        </div>
      </div>

      {/* 2. Today's AI Study Plan */}
      <div className="bg-[#0D1527] border border-indigo-950/80 rounded-2xl p-4 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-400 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Today's Focus Tasks</h3>
              <p className="text-[11px] text-slate-400">{profile.dailyStudyHours} hours commitment</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('roadmap')}
            className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-0.5 cursor-pointer"
          >
            Full Roadmap <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {todaysTasks.length > 0 ? (
          <div className="space-y-2">
            {todaysTasks.map((t) => (
              <div
                key={t.id}
                className="flex items-start justify-between p-2.5 rounded-xl bg-[#080D1A] border border-indigo-950/60 hover:border-indigo-800/60 transition"
              >
                <div className="flex items-start gap-2.5 flex-1 pr-2">
                  <button
                    onClick={() => onToggleTopic(t.id)}
                    className="mt-0.5 text-slate-500 hover:text-emerald-400 transition cursor-pointer"
                    title="Mark as completed"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">{t.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {t.category} • {t.estimatedHours}h • {t.difficulty}
                    </p>
                    <p className="text-[10px] text-indigo-300/90 mt-1 italic font-mono">
                      Exercise: {t.practiceExercise}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 shrink-0">
                  {t.category}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 bg-[#080D1A] rounded-xl border border-indigo-950/50">
            <CheckCircle2 className="w-7 h-7 text-emerald-400 mx-auto mb-1" />
            <p className="text-xs font-semibold text-slate-200">All planned tasks completed for today!</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Explore mock interviews or record new solved problems.</p>
          </div>
        )}
      </div>

      {/* 3. Coding Statistics & Streak Overview */}
      <div className="grid grid-cols-2 gap-3">
        {/* Coding Stats Card */}
        <div
          onClick={() => onNavigate('practice')}
          className="bg-[#0D1527] border border-indigo-950/80 rounded-2xl p-3.5 hover:border-indigo-700/60 transition cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Code2 className="w-4 h-4" />
            </div>
            <span className="text-[10px] text-slate-400">Total Solved</span>
          </div>

          <div className="my-2">
            <div className="text-xl font-extrabold text-white">{solvedCount}</div>
            <p className="text-[10px] text-slate-400">Target: 150+ for Tier 1</p>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] pt-2 border-t border-indigo-950">
            <span className="text-emerald-400 font-semibold">{easyCount}E</span>
            <span className="text-amber-400 font-semibold">{mediumCount}M</span>
            <span className="text-rose-400 font-semibold">{hardCount}H</span>
          </div>
        </div>

        {/* Live Mock Interview Quick Launch */}
        <div
          onClick={() => onNavigate('interview')}
          className="bg-gradient-to-br from-indigo-950/80 to-[#0D1527] border border-indigo-900/80 rounded-2xl p-3.5 hover:border-indigo-600 transition cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <MessagesSquare className="w-4 h-4" />
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-900/60 text-purple-300 font-semibold">
              Live AI
            </span>
          </div>

          <div className="my-2">
            <div className="text-sm font-bold text-white">AI Mock Interview</div>
            <p className="text-[10px] text-slate-300 mt-0.5">1-on-1 DSA, DBMS & OS simulation</p>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-indigo-300 font-medium">
            <Play className="w-3 h-3 fill-indigo-300" />
            <span>Start Practice Round</span>
          </div>
        </div>
      </div>

      {/* 4. Quick Access Placement Tools */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 px-0.5">
          Placement Toolkit
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          {/* Resume ATS Analyzer */}
          <button
            onClick={onOpenResumeATS}
            className="flex flex-col text-left p-3 rounded-2xl bg-[#0D1527] border border-indigo-950/80 hover:border-indigo-700/60 transition cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-2 group-hover:scale-105 transition">
              <FileText className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-white">AI Resume ATS</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Score & rewrite bullet points</p>
          </button>

          {/* Job Description Matcher */}
          <button
            onClick={onOpenJdMatcher}
            className="flex flex-col text-left p-3 rounded-2xl bg-[#0D1527] border border-indigo-950/80 hover:border-indigo-700/60 transition cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-105 transition">
              <Briefcase className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-white">JD Skill Matcher</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Compare skills against job posts</p>
          </button>

          {/* Project Portfolio Builder */}
          <button
            onClick={() => onNavigate('projects')}
            className="flex flex-col text-left p-3 rounded-2xl bg-[#0D1527] border border-indigo-950/80 hover:border-indigo-700/60 transition cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2 group-hover:scale-105 transition">
              <Award className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-white">Project Portfolio</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">STAR resume bullets & viva prep</p>
          </button>

          {/* College Project Report & Viva Hub */}
          <button
            onClick={onOpenCollegeDocs}
            className="flex flex-col text-left p-3 rounded-2xl bg-gradient-to-br from-violet-950/60 to-[#0D1527] border border-violet-900/60 hover:border-violet-600 transition cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-violet-600/30 text-violet-300 flex items-center justify-center mb-2 group-hover:scale-105 transition">
              <GraduationCap className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-violet-200">College Project Hub</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Report, Viva Q&A & APK Guide</p>
          </button>
        </div>
      </div>

    </div>
  );
};
