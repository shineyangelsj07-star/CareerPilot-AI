import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  CheckCircle2,
  Circle,
  Clock,
  BookOpen,
  Filter,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import { StudentProfile, RoadmapData, RoadmapTopic } from '../types';
import { generateRoadmapApi } from '../services/api';

interface RoadmapScreenProps {
  profile: StudentProfile;
  roadmap: RoadmapData | null;
  completedTopicIds: string[];
  onToggleTopic: (topicId: string) => void;
  onUpdateRoadmap: (data: RoadmapData) => void;
}

export const RoadmapScreen: React.FC<RoadmapScreenProps> = ({
  profile,
  roadmap,
  completedTopicIds,
  onToggleTopic,
  onUpdateRoadmap,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [expandedWeek, setExpandedWeek] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const weeks = roadmap?.weeks || [];
  const allTopics = weeks.flatMap((w) => w.topics);
  const totalTopicsCount = allTopics.length;
  const completedCount = allTopics.filter((t) => completedTopicIds.includes(t.id)).length;
  const progressPercent = totalTopicsCount > 0 ? Math.round((completedCount / totalTopicsCount) * 100) : 0;

  const categories = ['ALL', 'DSA', 'DBMS', 'OS', 'CN', 'SQL', 'TechStack', 'AIML'];

  const handleRegenerate = async () => {
    setIsGenerating(true);
    setErrorMessage('');
    try {
      const data = await generateRoadmapApi({
        name: profile.name,
        branch: profile.branch,
        yearOfStudy: profile.yearOfStudy,
        targetRole: profile.targetRole,
        technicalSkills: profile.technicalSkills,
        dailyStudyHours: profile.dailyStudyHours,
        currentProficiency: profile.currentProficiency,
      });
      onUpdateRoadmap(data);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Could not regenerate roadmap. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 text-slate-100 pb-20">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#12182F] via-[#0E1528] to-[#0A0F1E] border border-indigo-900/60 rounded-3xl p-4 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-semibold mb-1">
              <Compass className="w-3.5 h-3.5" />
              <span>Personalized Curriculum</span>
            </div>
            <h2 className="text-base font-extrabold text-white">
              {roadmap?.totalWeeks || 6}-Week Placement Roadmap
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Target: <span className="text-indigo-300 font-medium">{profile.targetRole}</span>
            </p>
          </div>

          <button
            onClick={handleRegenerate}
            disabled={isGenerating}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 text-xs font-semibold transition cursor-pointer disabled:opacity-50"
            title="Regenerate roadmap with Gemini AI"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Curating...' : 'Regenerate'}</span>
          </button>
        </div>

        {/* Milestone summary */}
        {roadmap?.roleSummary && (
          <p className="text-xs text-slate-300 mt-3 pt-2.5 border-t border-indigo-950 leading-relaxed">
            {roadmap.roleSummary}
          </p>
        )}

        {/* Overall Completion Progress Bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-300 font-medium">Curriculum Completion</span>
            <span className="font-bold text-emerald-400">
              {completedCount} / {totalTopicsCount} ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-2 bg-[#060A14] rounded-full overflow-hidden border border-indigo-950">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Source Badge */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-indigo-950/60 text-[10px] text-slate-400">
          <span>Weekly Commitment: {roadmap?.weeklyCommitmentHours || profile.dailyStudyHours * 6} hrs</span>
          <span className="px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 font-medium border border-indigo-800">
            {roadmap?.isAiGenerated ? '✨ Gemini AI Tailored' : '📚 Curated Placement Standard'}
          </span>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 bg-rose-950/60 border border-rose-800/80 rounded-2xl text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap transition cursor-pointer border ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white border-indigo-500 font-semibold shadow-sm'
                : 'bg-[#0D1527] text-slate-400 border-indigo-950 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Weeks List */}
      <div className="space-y-3">
        {weeks.map((week) => {
          const isExpanded = expandedWeek === week.weekNumber;
          const filteredTopics = week.topics.filter(
            (t) => selectedCategory === 'ALL' || t.category === selectedCategory
          );
          const weekDoneCount = week.topics.filter((t) => completedTopicIds.includes(t.id)).length;
          const isWeekComplete = week.topics.length > 0 && weekDoneCount === week.topics.length;

          if (selectedCategory !== 'ALL' && filteredTopics.length === 0) return null;

          return (
            <div
              key={week.weekNumber}
              className={`bg-[#0D1527] border rounded-2xl overflow-hidden transition-all duration-200 shadow-md ${
                isWeekComplete
                  ? 'border-emerald-900/60'
                  : isExpanded
                  ? 'border-indigo-700/80'
                  : 'border-indigo-950/80'
              }`}
            >
              {/* Week Accordion Header */}
              <button
                onClick={() => setExpandedWeek(isExpanded ? 0 : week.weekNumber)}
                className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer hover:bg-indigo-950/20 transition"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isWeekComplete
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                    }`}
                  >
                    W{week.weekNumber}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-white tracking-tight">
                        {week.theme}
                      </h3>
                      {isWeekComplete && (
                        <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Done
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{week.goal}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className="text-[10px] text-slate-400 bg-[#080D1A] px-2 py-0.5 rounded-full border border-indigo-950">
                    {weekDoneCount}/{week.topics.length}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Topics inside week */}
              {isExpanded && (
                <div className="p-3 pt-0 space-y-2 border-t border-indigo-950/60 mt-1">
                  {filteredTopics.map((topic) => {
                    const isCompleted = completedTopicIds.includes(topic.id);
                    return (
                      <div
                        key={topic.id}
                        className={`p-3 rounded-xl border transition-all ${
                          isCompleted
                            ? 'bg-emerald-950/15 border-emerald-900/40 opacity-90'
                            : 'bg-[#080D1A] border-indigo-950/70 hover:border-indigo-800'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2.5 flex-1">
                            <button
                              onClick={() => onToggleTopic(topic.id)}
                              className="mt-0.5 cursor-pointer text-slate-400 hover:text-emerald-400 transition"
                              title={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-950" />
                              ) : (
                                <Circle className="w-4 h-4" />
                              )}
                            </button>

                            <div className="flex-1">
                              <h4
                                className={`text-xs font-bold ${
                                  isCompleted ? 'line-through text-slate-400' : 'text-slate-100'
                                }`}
                              >
                                {topic.title}
                              </h4>

                              {/* Key Concepts Tags */}
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {topic.keyConcepts.map((concept, i) => (
                                  <span
                                    key={i}
                                    className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-900/60"
                                  >
                                    {concept}
                                  </span>
                                ))}
                              </div>

                              {/* Practice Exercise Prompt */}
                              <div className="mt-2 bg-[#0C1222] p-2 rounded-lg border border-indigo-950 text-[11px] text-slate-300 font-mono">
                                <span className="text-indigo-400 font-semibold font-sans">Practice: </span>
                                {topic.practiceExercise}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                              {topic.category}
                            </span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                              <Clock className="w-3 h-3" /> {topic.estimatedHours}h
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
