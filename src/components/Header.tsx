import React from 'react';
import { Sparkles, GraduationCap, Flame, ShieldCheck } from 'lucide-react';
import { StudentProfile } from '../types';
import { ApiStatus } from '../services/api';

interface HeaderProps {
  profile: StudentProfile;
  apiStatus: ApiStatus | null;
  onOpenCollegeDocs: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  apiStatus,
  onOpenCollegeDocs,
  onOpenProfile,
}) => {
  const isAiActive = apiStatus?.hasGemini;

  return (
    <header className="w-full bg-[#0B1224]/90 backdrop-blur-md border-b border-indigo-950/60 px-4 py-2.5 flex items-center justify-between shrink-0 z-20">
      {/* Brand & Target Role */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-600/30 ring-1 ring-white/10">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1">
              CareerPilot <span className="text-xs px-1.5 py-0.2 bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30 font-semibold">AI</span>
            </h1>
          </div>
          <p className="text-[10px] text-slate-400 truncate max-w-[150px] sm:max-w-xs">
            {profile.targetRole.replace(' (SDE)', '')}
          </p>
        </div>
      </div>

      {/* Right Actions: College Viva Hub & AI Status */}
      <div className="flex items-center gap-2">
        {/* Streak counter */}
        <div
          title={`${profile.streakDays} Day Preparation Streak!`}
          className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-semibold"
        >
          <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
          <span>{profile.streakDays}d</span>
        </div>

        {/* College Project & Viva Guide Trigger */}
        <button
          onClick={onOpenCollegeDocs}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-950/80 hover:bg-violet-900 border border-violet-500/40 text-violet-200 text-[11px] font-semibold transition cursor-pointer shadow-sm shadow-violet-950/50"
          title="Open CSE-AIML Project Report, Viva Questions & APK Instructions"
        >
          <GraduationCap className="w-3.5 h-3.5 text-violet-300" />
          <span className="hidden xs:inline">Project Hub</span>
        </button>

        {/* AI Engine Status indicator */}
        <div
          className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
            isAiActive
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
              : 'bg-indigo-950/40 border-indigo-500/30 text-indigo-300'
          }`}
          title={
            isAiActive
              ? 'Google Gemini 3.8 Flash API Active'
              : 'Curated Placement Knowledge Engine (Live AI Fallback)'
          }
        >
          <ShieldCheck className="w-3 h-3" />
          <span className="hidden sm:inline">{isAiActive ? 'Gemini 3.8' : 'Curated'}</span>
        </div>

        {/* Profile Avatar trigger */}
        <button
          onClick={onOpenProfile}
          className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center ring-2 ring-indigo-400/40 cursor-pointer hover:opacity-90 transition"
          title="Edit Profile & Preferences"
        >
          {profile.name.charAt(0)}
        </button>
      </div>
    </header>
  );
};
