import React, { useState, useEffect } from 'react';
import {
  Code2,
  Plus,
  Flame,
  Search,
  Filter,
  CheckCircle2,
  Trash2,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Terminal,
  FileCode,
  Tag,
  Clock,
  Sparkles,
} from 'lucide-react';
import { CodingProblem, CodingDifficulty } from '../types';

interface PracticeScreenProps {
  problems: CodingProblem[];
  streakDays: number;
  onAddProblem: (problem: CodingProblem) => void;
  onDeleteProblem: (id: string) => void;
}

const TEMPLATES: Record<string, string> = {
  'C++': `// C++ Optimal Solution
#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> solveProblem(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (seen.count(complement)) {
                return {seen[complement], i};
            }
            seen[nums[i]] = i;
        }
        return {};
    }
};`,
  'Python': `# Python Optimal Solution
from typing import List

class Solution:
    def solve_problem(self, nums: List[int], target: int) -> List[int]:
        lookup = {}
        for idx, val in enumerate(nums):
            diff = target - val
            if diff in lookup:
                return [lookup[diff], idx]
            lookup[val] = idx
        return []`,
  'Java': `// Java Solution
import java.util.*;

class Solution {
    public int[] solveProblem(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[0];
    }
}`,
  'SQL': `-- SQL Window Function Query
WITH RankedSalaries AS (
    SELECT 
        departmentId,
        salary,
        DENSE_RANK() OVER (PARTITION BY departmentId ORDER BY salary DESC) as rnk
    FROM Employee
)
SELECT departmentId, salary 
FROM RankedSalaries 
WHERE rnk = 1;`,
};

export const PracticeScreen: React.FC<PracticeScreenProps> = ({
  problems,
  streakDays,
  onAddProblem,
  onDeleteProblem,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'tracker' | 'scratchpad'>('tracker');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Add Form State
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState<CodingProblem['platform']>('LeetCode');
  const [difficulty, setDifficulty] = useState<CodingDifficulty>('Medium');
  const [topic, setTopic] = useState('Arrays & Hashing');
  const [language, setLanguage] = useState<CodingProblem['language']>('C++');
  const [timeComplexity, setTimeComplexity] = useState('O(N)');
  const [spaceComplexity, setSpaceComplexity] = useState('O(N)');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');

  // Scratchpad State
  const [selectedLang, setSelectedLang] = useState<string>('C++');
  const [scratchCode, setScratchCode] = useState<string>(TEMPLATES['C++']);
  const [scratchNotes, setScratchNotes] = useState<string>('Time Complexity: O(N) | Space Complexity: O(N) auxiliary');

  // Practice Timer State
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLangChange = (lang: string) => {
    setSelectedLang(lang);
    if (TEMPLATES[lang]) {
      setScratchCode(TEMPLATES[lang]);
    }
  };

  const handleSaveProblem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Please enter problem title.');
      return;
    }

    const newProb: CodingProblem = {
      id: `prob-${Date.now()}`,
      title: title.trim(),
      platform,
      difficulty,
      topic: topic.trim() || 'General DSA',
      language,
      solvedDate: new Date().toISOString().split('T')[0],
      timeComplexity: timeComplexity.trim() || 'O(N)',
      spaceComplexity: spaceComplexity.trim() || 'O(1)',
      notes: notes.trim(),
    };

    onAddProblem(newProb);
    setTitle('');
    setNotes('');
    setFormError('');
    setIsAddModalOpen(false);
  };

  // Stats
  const totalSolved = problems.length;
  const easyCount = problems.filter((p) => p.difficulty === 'Easy').length;
  const mediumCount = problems.filter((p) => p.difficulty === 'Medium').length;
  const hardCount = problems.filter((p) => p.difficulty === 'Hard').length;

  const filteredProblems = problems.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.language.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDiff = selectedDifficulty === 'ALL' || p.difficulty === selectedDifficulty;
    return matchesSearch && matchesDiff;
  });

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 text-slate-100 pb-20">
      
      {/* Sub Tabs: Tracker vs Scratchpad */}
      <div className="bg-[#0D1527] p-1 rounded-2xl border border-indigo-950 flex items-center gap-1 shadow-sm">
        <button
          onClick={() => setActiveSubTab('tracker')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
            activeSubTab === 'tracker'
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Practice Log & Stats</span>
        </button>
        <button
          onClick={() => setActiveSubTab('scratchpad')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
            activeSubTab === 'scratchpad'
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Code Scratchpad & Timer</span>
        </button>
      </div>

      {activeSubTab === 'tracker' ? (
        <>
          {/* Stats Card */}
          <div className="bg-gradient-to-br from-[#12182F] via-[#0D1426] to-[#0A0E1A] border border-indigo-900/60 rounded-3xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">
                  LeetCode & GFG Progress
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <h3 className="text-2xl font-black text-white">{totalSolved}</h3>
                  <span className="text-xs text-slate-400">Problems Solved</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
                  <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{streakDays}d Streak</span>
                </div>

                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 shadow-md shadow-indigo-600/30 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log Problem</span>
                </button>
              </div>
            </div>

            {/* Difficulty Bars */}
            <div className="space-y-2 pt-2 border-t border-indigo-950/70">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-emerald-400 font-medium">Easy ({easyCount})</span>
                <span className="text-amber-400 font-medium">Medium ({mediumCount})</span>
                <span className="text-rose-400 font-medium">Hard ({hardCount})</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full flex overflow-hidden border border-indigo-950">
                <div
                  style={{ width: `${totalSolved ? (easyCount / totalSolved) * 100 : 33}%` }}
                  className="bg-emerald-400 h-full"
                ></div>
                <div
                  style={{ width: `${totalSolved ? (mediumCount / totalSolved) * 100 : 33}%` }}
                  className="bg-amber-400 h-full"
                ></div>
                <div
                  style={{ width: `${totalSolved ? (hardCount / totalSolved) * 100 : 34}%` }}
                  className="bg-rose-500 h-full"
                ></div>
              </div>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by title, topic, language..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0D1527] border border-indigo-950 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-600"
              />
            </div>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-[#0D1527] border border-indigo-950 rounded-xl px-2.5 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-600"
            >
              <option value="ALL">All Levels</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Problem List */}
          <div className="space-y-2.5">
            {filteredProblems.length > 0 ? (
              filteredProblems.map((prob) => {
                const diffColor =
                  prob.difficulty === 'Easy'
                    ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800'
                    : prob.difficulty === 'Medium'
                    ? 'text-amber-400 bg-amber-950/60 border-amber-800'
                    : 'text-rose-400 bg-rose-950/60 border-rose-800';

                return (
                  <div
                    key={prob.id}
                    className="p-3.5 rounded-2xl bg-[#0D1527] border border-indigo-950/80 hover:border-indigo-800 transition shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 pr-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${diffColor}`}>
                            {prob.difficulty}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-900 font-mono">
                            {prob.platform}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {prob.solvedDate}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white mt-1.5 tracking-tight">{prob.title}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {prob.topic} • <span className="font-mono text-indigo-300">{prob.language}</span>
                        </p>
                      </div>

                      <button
                        onClick={() => onDeleteProblem(prob.id)}
                        className="text-slate-600 hover:text-rose-400 p-1 transition cursor-pointer"
                        title="Delete log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Complexity & Notes */}
                    {(prob.timeComplexity || prob.notes) && (
                      <div className="mt-2 pt-2 border-t border-indigo-950 text-[11px] text-slate-300 space-y-1">
                        {prob.timeComplexity && (
                          <div className="flex items-center gap-2 font-mono text-[10px] text-indigo-300">
                            <span>Time: {prob.timeComplexity}</span>
                            <span>•</span>
                            <span>Space: {prob.spaceComplexity}</span>
                          </div>
                        )}
                        {prob.notes && (
                          <p className="text-slate-400 text-[10px] italic bg-[#080D1A] p-1.5 rounded-lg border border-indigo-950/50">
                            💡 {prob.notes}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 bg-[#0D1527] rounded-2xl border border-indigo-950 text-slate-400">
                <Code2 className="w-8 h-8 text-indigo-400 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-semibold text-slate-300">No problems found</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Click "Log Problem" above to record your latest solved question.
                </p>
              </div>
            )}
          </div>
        </>
      ) : (
        /* SCRATCHPAD & TIMER WORKSPACE */
        <div className="space-y-3">
          {/* Interview Timer Card */}
          <div className="bg-[#0D1527] border border-indigo-950 rounded-2xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                <Timer className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Timed Session</span>
                <div className="font-mono text-base font-extrabold text-white">
                  {formatTimer(timerSeconds)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition ${
                  isTimerRunning
                    ? 'bg-amber-600 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-white" />}
                <span>{isTimerRunning ? 'Pause' : 'Start'}</span>
              </button>
              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerSeconds(0);
                }}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                title="Reset timer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Language Selector & Editor Header */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1">
              <FileCode className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-xs font-bold text-slate-200">Algorithm Scratchpad</span>
            </div>
            <div className="flex gap-1">
              {['C++', 'Python', 'Java', 'SQL'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLangChange(lang)}
                  className={`text-[11px] px-2.5 py-0.5 rounded-lg font-mono transition cursor-pointer border ${
                    selectedLang === lang
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-[#0D1527] text-slate-400 border-indigo-950'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Code Textarea */}
          <div className="bg-[#080D1A] border border-indigo-950 rounded-2xl p-2.5 shadow-inner">
            <div className="flex items-center justify-between text-[10px] text-slate-500 pb-1.5 mb-1.5 border-b border-indigo-950 font-mono">
              <span>// Monospace Scratchpad (Syntax & Complexity review)</span>
              <span>{selectedLang}</span>
            </div>
            <textarea
              value={scratchCode}
              onChange={(e) => setScratchCode(e.target.value)}
              rows={12}
              className="w-full bg-transparent text-slate-200 font-mono text-xs focus:outline-none resize-none leading-relaxed"
              spellCheck={false}
            />
          </div>

          {/* Complexity / Dry Run Notes */}
          <div className="bg-[#0D1527] border border-indigo-950 rounded-2xl p-3">
            <label className="block text-[11px] font-bold text-slate-300 mb-1">
              Dry Run & Complexity Analysis Notes
            </label>
            <input
              type="text"
              value={scratchNotes}
              onChange={(e) => setScratchNotes(e.target.value)}
              placeholder="e.g. O(N) Time, O(1) Space, handles duplicate values"
              className="w-full bg-[#080D1A] border border-indigo-950 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-600"
            />
            <p className="text-[10px] text-slate-500 mt-1.5">
              Notice: CareerPilot AI focuses on algorithmic logic and interview preparation. Code execution is designed for local IDEs / LeetCode.
            </p>
          </div>
        </div>
      )}

      {/* Add Problem Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="w-full max-w-sm bg-[#0D1527] border border-indigo-900 rounded-3xl p-5 shadow-2xl text-slate-100">
            <h3 className="text-sm font-bold text-white mb-2">Record Solved Problem</h3>
            
            {formError && (
              <div className="text-rose-400 text-xs bg-rose-950/60 p-2 rounded-xl mb-2">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveProblem} className="space-y-2.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Problem Title</label>
                <input
                  type="text"
                  placeholder="e.g. Trapping Rain Water"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#080D1A] border border-indigo-950 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Platform</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as any)}
                    className="w-full bg-[#080D1A] border border-indigo-950 rounded-xl px-2 py-1.5 text-white"
                  >
                    <option value="LeetCode">LeetCode</option>
                    <option value="GeeksforGeeks">GeeksforGeeks</option>
                    <option value="CodeStudio">CodeStudio</option>
                    <option value="CodeChef">CodeChef</option>
                    <option value="HackerRank">HackerRank</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full bg-[#080D1A] border border-indigo-950 rounded-xl px-2 py-1.5 text-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">DSA Topic</label>
                  <input
                    type="text"
                    placeholder="e.g. Dynamic Programming"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full bg-[#080D1A] border border-indigo-950 rounded-xl px-2.5 py-1.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as any)}
                    className="w-full bg-[#080D1A] border border-indigo-950 rounded-xl px-2 py-1.5 text-white font-mono"
                  >
                    <option value="C++">C++</option>
                    <option value="Python">Python</option>
                    <option value="Java">Java</option>
                    <option value="SQL">SQL</option>
                    <option value="JavaScript">JavaScript</option>
                    <option value="C">C</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono">
                <div>
                  <label className="block text-slate-300 font-sans font-medium mb-1">Time Complexity</label>
                  <input
                    type="text"
                    placeholder="O(N)"
                    value={timeComplexity}
                    onChange={(e) => setTimeComplexity(e.target.value)}
                    className="w-full bg-[#080D1A] border border-indigo-950 rounded-xl px-2.5 py-1.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-sans font-medium mb-1">Space Complexity</label>
                  <input
                    type="text"
                    placeholder="O(1)"
                    value={spaceComplexity}
                    onChange={(e) => setSpaceComplexity(e.target.value)}
                    className="w-full bg-[#080D1A] border border-indigo-950 rounded-xl px-2.5 py-1.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Key Takeaway / Notes</label>
                <textarea
                  rows={2}
                  placeholder="Key intuition, tricky edge-cases..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#080D1A] border border-indigo-950 rounded-xl px-2.5 py-1.5 text-white resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold cursor-pointer"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
