import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Briefcase,
  Clock,
  Sparkles,
  RotateCcw,
  Download,
  Save,
  CheckCircle2,
  Trash2,
  Flame,
  Award,
} from 'lucide-react';
import { StudentProfile, TargetRole, YearOfStudy, ProficiencyLevel } from '../types';

interface ProfileScreenProps {
  profile: StudentProfile;
  onUpdateProfile: (updated: StudentProfile) => void;
  onResetDemoData: () => void;
}

const TARGET_ROLES: TargetRole[] = [
  'Software Development Engineer (SDE)',
  'AI / Machine Learning Engineer',
  'Full Stack Web Developer',
  'Backend Engineer',
  'Frontend Engineer',
  'Data Analyst / Data Engineer',
  'Cloud / DevOps Engineer',
];

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profile,
  onUpdateProfile,
  onResetDemoData,
}) => {
  const [name, setName] = useState(profile.name);
  const [college, setCollege] = useState(profile.college);
  const [branch, setBranch] = useState(profile.branch);
  const [yearOfStudy, setYearOfStudy] = useState<YearOfStudy>(profile.yearOfStudy);
  const [targetRole, setTargetRole] = useState<TargetRole>(profile.targetRole);
  const [dailyHours, setDailyHours] = useState(profile.dailyStudyHours);
  const [proficiency, setProficiency] = useState<ProficiencyLevel>(profile.currentProficiency);
  const [skillsString, setSkillsString] = useState(profile.technicalSkills.join(', '));
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const skillsArray = skillsString
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const updated: StudentProfile = {
      ...profile,
      name: name.trim() || profile.name,
      college: college.trim() || profile.college,
      branch: branch.trim() || profile.branch,
      yearOfStudy,
      targetRole,
      dailyStudyHours: dailyHours,
      currentProficiency: proficiency,
      technicalSkills: skillsArray.length > 0 ? skillsArray : profile.technicalSkills,
    };

    onUpdateProfile(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportData = () => {
    const backup = {
      profile,
      exportedAt: new Date().toISOString(),
      app: 'CareerPilot AI – Smart Placement Assistant',
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `careerpilot_backup_${profile.name.replace(/\s+/g, '_').toLowerCase()}.json`;
    a.click();
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 text-slate-100 pb-20">
      
      {/* Profile Card Header */}
      <div className="bg-gradient-to-br from-[#12182F] via-[#0D1426] to-[#0A0E1A] border border-indigo-900/60 rounded-3xl p-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-600 text-white font-black text-xl flex items-center justify-center shadow-lg ring-2 ring-indigo-400/30">
            {profile.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white">{profile.name}</h2>
            <p className="text-xs text-indigo-300 font-medium">{profile.college}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {profile.branch} • {profile.yearOfStudy}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-indigo-950/70 text-xs">
          <div className="bg-[#080D1A] p-2.5 rounded-xl border border-indigo-950">
            <span className="text-[10px] text-slate-400 block">Target Role</span>
            <span className="font-bold text-white text-[11px] truncate block">{profile.targetRole}</span>
          </div>

          <div className="bg-[#080D1A] p-2.5 rounded-xl border border-indigo-950 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block">Current Streak</span>
              <span className="font-bold text-amber-300 text-[11px]">{profile.streakDays} Days</span>
            </div>
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="bg-[#0D1527] border border-indigo-950 rounded-2xl p-4 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Edit Student Information & Goals
          </h3>
          {savedSuccess && (
            <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1 animate-fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" /> Saved!
            </span>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#080D1A] border border-indigo-950 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">College / University</label>
            <input
              type="text"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              className="w-full bg-[#080D1A] border border-indigo-950 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Branch</label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full bg-[#080D1A] border border-indigo-950 rounded-xl px-2.5 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Year of Study</label>
              <select
                value={yearOfStudy}
                onChange={(e) => setYearOfStudy(e.target.value as YearOfStudy)}
                className="w-full bg-[#080D1A] border border-indigo-950 rounded-xl px-2 py-2 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year / Final Year">4th Year / Final</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Target Placement Role</label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value as TargetRole)}
              className="w-full bg-[#080D1A] border border-indigo-950 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            >
              {TARGET_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Technical Skills (Comma-separated)
            </label>
            <input
              type="text"
              value={skillsString}
              onChange={(e) => setSkillsString(e.target.value)}
              className="w-full bg-[#080D1A] border border-indigo-950 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <div className="flex justify-between font-semibold text-slate-300 mb-1">
              <span>Daily Study Hours Target</span>
              <span className="text-indigo-400 font-bold">{dailyHours} hours/day</span>
            </div>
            <input
              type="range"
              min={1}
              max={7}
              step={1}
              value={dailyHours}
              onChange={(e) => setDailyHours(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30 cursor-pointer transition"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Profile Updates</span>
          </button>
        </form>
      </div>

      {/* Danger & Backup Actions */}
      <div className="bg-[#0D1527] border border-indigo-950 rounded-2xl p-4 shadow-md space-y-2.5">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Data Management & Reset
        </h3>

        <button
          onClick={handleExportData}
          className="w-full py-2.5 px-3 rounded-xl bg-[#080D1A] border border-indigo-950 hover:border-indigo-800 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-indigo-400" />
          <span>Export Preparation Data (JSON)</span>
        </button>

        <button
          onClick={() => {
            if (confirm('Are you sure you want to reset all demo data and restart fresh?')) {
              onResetDemoData();
            }
          }}
          className="w-full py-2.5 px-3 rounded-xl bg-rose-950/20 hover:bg-rose-950/40 border border-rose-900/40 text-rose-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
          <span>Reset Demo Data & Re-Onboard</span>
        </button>
      </div>

      <div className="text-center text-[11px] text-slate-500 py-2">
        CareerPilot AI v1.0.0 • Designed for CSE-AIML Campus Placement Excellence
      </div>

    </div>
  );
};
