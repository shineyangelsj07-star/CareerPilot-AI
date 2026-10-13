import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, GraduationCap, Briefcase, Clock, Plus, X } from 'lucide-react';
import { StudentProfile, TargetRole, YearOfStudy, ProficiencyLevel } from '../types';

interface OnboardingModalProps {
  initialProfile: StudentProfile;
  isOpen: boolean;
  onComplete: (profile: StudentProfile) => void;
}

const PRESET_SKILLS = [
  'C++', 'Python', 'Java', 'DSA', 'DBMS', 'SQL', 'Operating Systems',
  'Computer Networks', 'React', 'Node.js', 'Machine Learning', 'Git',
  'Docker', 'AWS', 'TensorFlow', 'TypeScript'
];

const TARGET_ROLES: TargetRole[] = [
  'Software Development Engineer (SDE)',
  'AI / Machine Learning Engineer',
  'Full Stack Web Developer',
  'Backend Engineer',
  'Frontend Engineer',
  'Data Analyst / Data Engineer',
  'Cloud / DevOps Engineer'
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  initialProfile,
  isOpen,
  onComplete,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState(initialProfile.name || '');
  const [college, setCollege] = useState(initialProfile.college || '');
  const [branch, setBranch] = useState(initialProfile.branch || 'Computer Science & AI (CSE-AIML)');
  const [yearOfStudy, setYearOfStudy] = useState<YearOfStudy>(initialProfile.yearOfStudy || '3rd Year');
  const [targetRole, setTargetRole] = useState<TargetRole>(initialProfile.targetRole || 'Software Development Engineer (SDE)');
  const [dailyHours, setDailyHours] = useState(initialProfile.dailyStudyHours || 3);
  const [proficiency, setProficiency] = useState<ProficiencyLevel>(initialProfile.currentProficiency || 'Intermediate');
  const [skills, setSkills] = useState<string[]>(initialProfile.technicalSkills || ['C++', 'Python', 'DSA', 'SQL']);
  const [customSkill, setCustomSkill] = useState('');
  const [validationError, setValidationError] = useState('');

  if (!isOpen) return null;

  const handleToggleSkill = (skill: string) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter((s) => s !== skill));
    } else {
      setSkills([...skills, skill]);
    }
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSkill.trim() && !skills.includes(customSkill.trim())) {
      setSkills([...skills, customSkill.trim()]);
      setCustomSkill('');
    }
  };

  const handleNext = () => {
    if (!name.trim()) {
      setValidationError('Please enter your full name.');
      return;
    }
    if (!college.trim()) {
      setValidationError('Please enter your college or university name.');
      return;
    }
    setValidationError('');
    setStep(2);
  };

  const handleSubmit = () => {
    if (skills.length === 0) {
      setValidationError('Please select at least one technical skill.');
      return;
    }
    setValidationError('');

    const updated: StudentProfile = {
      ...initialProfile,
      name: name.trim(),
      college: college.trim(),
      branch: branch.trim(),
      yearOfStudy,
      targetRole,
      dailyStudyHours: dailyHours,
      currentProficiency: proficiency,
      technicalSkills: skills,
      isOnboarded: true,
      streakDays: initialProfile.streakDays || 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
    };

    onComplete(updated);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 overflow-y-auto animate-fade-in">
      <div className="w-full max-w-md bg-[#0D1527] border border-indigo-900/60 rounded-3xl p-6 shadow-2xl text-slate-100 flex flex-col relative overflow-hidden">
        
        {/* Ambient background glow */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

        {step === 1 ? (
          /* STEP 1: WELCOME & ACADEMIC INFO */
          <div className="flex flex-col gap-4 relative z-10">
            {/* Header / Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-600/40">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-white tracking-tight">
                  CareerPilot <span className="text-indigo-400">AI</span>
                </h2>
                <p className="text-xs text-indigo-300 font-medium">Smart Placement & Internship Assistant</p>
              </div>
            </div>

            <div className="bg-indigo-950/40 border border-indigo-800/40 rounded-2xl p-3 text-xs text-slate-300 leading-relaxed">
              👋 Welcome! Prepare for top campus placements with AI-curated study roadmaps, resume ATS reviews, live mock interviews, and coding streak trackers tailored for engineering students.
            </div>

            {validationError && (
              <div className="text-rose-400 text-xs bg-rose-950/50 border border-rose-800/60 p-2.5 rounded-xl font-medium">
                {validationError}
              </div>
            )}

            {/* Inputs */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Arjun Sharma"
                  className="w-full bg-[#080D1A] border border-indigo-950 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  College / University <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g. National Institute of Engineering"
                  className="w-full bg-[#080D1A] border border-indigo-950 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Branch / Department
                  </label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full bg-[#080D1A] border border-indigo-950 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Computer Science & AI (CSE-AIML)">CSE - AIML</option>
                    <option value="Computer Science Engineering (CSE)">CSE Core</option>
                    <option value="Information Technology (IT)">IT</option>
                    <option value="Data Science & Engineering">Data Science</option>
                    <option value="Electronics & Communication (ECE)">ECE</option>
                    <option value="Other Engineering">Other Engineering</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Year of Study
                  </label>
                  <select
                    value={yearOfStudy}
                    onChange={(e) => setYearOfStudy(e.target.value as YearOfStudy)}
                    className="w-full bg-[#080D1A] border border-indigo-950 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="1st Year">1st Year (Foundations)</option>
                    <option value="2nd Year">2nd Year (Core DSA)</option>
                    <option value="3rd Year">3rd Year (Internship Ready)</option>
                    <option value="4th Year / Final Year">4th Year (Full-Time SDE)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="mt-2 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition cursor-pointer"
            >
              <span>Continue to Career Goals</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* STEP 2: CAREER GOALS & TECHNICAL SKILLS */
          <div className="flex flex-col gap-4 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Target Role & Tech Skills</h3>
                <p className="text-xs text-slate-400">Step 2 of 2: Personalizing your AI placement coach</p>
              </div>
              <button
                onClick={() => setStep(1)}
                className="text-xs text-indigo-400 hover:underline cursor-pointer"
              >
                Back
              </button>
            </div>

            {validationError && (
              <div className="text-rose-400 text-xs bg-rose-950/50 border border-rose-800/60 p-2.5 rounded-xl font-medium">
                {validationError}
              </div>
            )}

            {/* Target Role Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                Target Placement Role
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value as TargetRole)}
                className="w-full bg-[#080D1A] border border-indigo-950 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {TARGET_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Daily Hours Slider */}
            <div className="bg-[#080D1A] border border-indigo-950/70 p-3 rounded-2xl">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-violet-400" />
                  Daily Study Hours Commitment
                </span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold">
                  {dailyHours} hrs / day ({dailyHours * 6} hrs/week)
                </span>
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
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>1h (Consistent)</span>
                <span>3h (Recommended)</span>
                <span>7h (Placement Grind)</span>
              </div>
            </div>

            {/* Current Proficiency */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Current DSA / Coding Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Beginner', 'Intermediate', 'Advanced'] as ProficiencyLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setProficiency(lvl)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-medium border text-center transition cursor-pointer ${
                      proficiency === lvl
                        ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200 font-semibold'
                        : 'bg-[#080D1A] border-indigo-950/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Skills Chip Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Technical Skills Known ({skills.length} selected)
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1 bg-[#080D1A] border border-indigo-950 rounded-xl">
                {PRESET_SKILLS.map((sk) => {
                  const isSelected = skills.includes(sk);
                  return (
                    <button
                      key={sk}
                      type="button"
                      onClick={() => handleToggleSkill(sk)}
                      className={`text-[11px] px-2 py-1 rounded-lg border transition cursor-pointer flex items-center gap-1 ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-500 font-medium'
                          : 'bg-indigo-950/30 text-slate-400 border-indigo-900/50 hover:text-slate-200'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-2.5 h-2.5" />}
                      <span>{sk}</span>
                    </button>
                  );
                })}
              </div>

              {/* Add Custom Skill */}
              <form onSubmit={handleAddCustomSkill} className="flex gap-1.5 mt-2">
                <input
                  type="text"
                  placeholder="Add other skill (e.g. Flutter, Kotlin)..."
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  className="flex-1 bg-[#080D1A] border border-indigo-950 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 text-xs rounded-xl border border-indigo-700/60 font-medium cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="mt-2 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-indigo-600 to-violet-600 hover:opacity-95 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>Launch My CareerPilot AI</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
