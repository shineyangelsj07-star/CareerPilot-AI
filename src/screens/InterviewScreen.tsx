import React, { useState } from 'react';
import {
  MessagesSquare,
  Bot,
  Sparkles,
  Send,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Play,
  RotateCcw,
  Award,
  BookOpen,
  Code2,
  FileCheck2,
} from 'lucide-react';
import { InterviewQuestion, AnswerEvaluation } from '../types';
import { generateInterviewQuestionsApi, evaluateAnswerApi } from '../services/api';

const SUBJECTS = ['DSA', 'DBMS', 'OS', 'CN', 'SQL', 'Python', 'Java', 'C', 'AIML'];
const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];

export const InterviewScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'coach' | 'mock'>('coach');

  // Coach Mode State
  const [selectedSubject, setSelectedSubject] = useState('DSA');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Intermediate');
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(0);
  const [studentAnswer, setStudentAnswer] = useState<string>('');
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<AnswerEvaluation | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Mock Interview Mode State
  const [mockRoundActive, setMockRoundActive] = useState(false);
  const [mockQuestions, setMockQuestions] = useState<InterviewQuestion[]>([]);
  const [mockCurrentStep, setMockCurrentStep] = useState(0);
  const [mockAnswers, setMockAnswers] = useState<string[]>(['', '', '']);
  const [mockEvaluations, setMockEvaluations] = useState<AnswerEvaluation[]>([]);
  const [isMockLoading, setIsMockLoading] = useState(false);
  const [mockCompleted, setMockCompleted] = useState(false);

  // Load questions for Coach mode
  const handleFetchQuestions = async () => {
    setIsLoadingQuestions(true);
    setErrorMessage('');
    setEvaluation(null);
    setStudentAnswer('');
    setShowHint(false);
    try {
      const data = await generateInterviewQuestionsApi({
        subject: selectedSubject,
        difficulty: selectedDifficulty,
        count: 3,
      });
      setQuestions(data.questions);
      setActiveQuestionIdx(0);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to fetch interview questions');
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  // Evaluate Answer in Coach mode
  const handleEvaluateAnswer = async () => {
    if (!studentAnswer.trim() || studentAnswer.trim().length < 8) {
      setErrorMessage('Please type a substantive technical answer before submitting.');
      return;
    }
    const currentQ = questions[activeQuestionIdx];
    if (!currentQ) return;

    setIsEvaluating(true);
    setErrorMessage('');
    try {
      const result = await evaluateAnswerApi({
        question: currentQ.question,
        subject: currentQ.subject,
        studentAnswer: studentAnswer.trim(),
        difficulty: currentQ.difficulty,
      });
      setEvaluation(result);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Could not evaluate answer. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  // Start Live Mock Interview Round (3 progressive questions)
  const handleStartMockRound = async () => {
    setIsMockLoading(true);
    setMockCompleted(false);
    setMockCurrentStep(0);
    setMockAnswers(['', '', '']);
    setMockEvaluations([]);
    try {
      // Fetch 3 questions across fundamental, logic, and design
      const dsaData = await generateInterviewQuestionsApi({ subject: 'DSA', difficulty: 'Intermediate', count: 1 });
      const dbmsData = await generateInterviewQuestionsApi({ subject: 'DBMS', difficulty: 'Intermediate', count: 1 });
      const osData = await generateInterviewQuestionsApi({ subject: 'OS', difficulty: 'Intermediate', count: 1 });

      const assembled: InterviewQuestion[] = [
        dsaData.questions[0] || {
          id: 'mock-1',
          subject: 'DSA',
          difficulty: 'Intermediate',
          question: 'How do you detect a cycle in a Singly Linked List, and what is its Big-O complexity?',
          context: 'Amazon SDE 1 Technical Round 1',
          hint: "Think about Floyd's Tortoise and Hare algorithm.",
          keyConcepts: ['Two Pointers', 'Cycle Detection', 'O(1) Space'],
          expectedAnswerOutline: 'Slow and Fast pointers with O(N) time and O(1) space.',
        },
        dbmsData.questions[0] || {
          id: 'mock-2',
          subject: 'DBMS',
          difficulty: 'Intermediate',
          question: 'Explain ACID properties in relational databases with a real banking transfer scenario.',
          context: 'Campus Placement Round 2 Core CS Assessment',
          hint: 'Atomicity, Consistency, Isolation, Durability.',
          keyConcepts: ['Atomicity', 'Isolation Levels', 'WAL'],
          expectedAnswerOutline: 'Explain each property and how rollbacks guarantee financial integrity.',
        },
        osData.questions[0] || {
          id: 'mock-3',
          subject: 'OS',
          difficulty: 'Intermediate',
          question: 'What are Coffman conditions for Deadlock, and how does Resource Ordering prevent circular wait?',
          context: 'Operating Systems Viva & Technical Round',
          hint: 'Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait.',
          keyConcepts: ["Coffman's Conditions", 'Circular Wait', 'Deadlock Prevention'],
          expectedAnswerOutline: 'Four conditions stated with clear prevention techniques.',
        },
      ];

      setMockQuestions(assembled);
      setMockRoundActive(true);
    } catch (err: any) {
      setErrorMessage('Failed to initiate mock round. Using standard curated questions.');
    } finally {
      setIsMockLoading(false);
    }
  };

  // Submit step in Mock Round
  const handleSubmitMockStep = async () => {
    const currentQ = mockQuestions[mockCurrentStep];
    const currentAns = mockAnswers[mockCurrentStep];

    if (!currentAns.trim()) {
      setErrorMessage('Please type your answer before proceeding.');
      return;
    }

    setIsMockLoading(true);
    setErrorMessage('');
    try {
      const evalResult = await evaluateAnswerApi({
        question: currentQ.question,
        subject: currentQ.subject,
        studentAnswer: currentAns,
        difficulty: currentQ.difficulty,
      });

      const updatedEvals = [...mockEvaluations, evalResult];
      setMockEvaluations(updatedEvals);

      if (mockCurrentStep < 2) {
        setMockCurrentStep(mockCurrentStep + 1);
      } else {
        setMockCompleted(true);
      }
    } catch (err: any) {
      setErrorMessage('Evaluation failed. Proceeding with standard evaluation metrics.');
    } finally {
      setIsMockLoading(false);
    }
  };

  const currentCoachQ = questions[activeQuestionIdx];

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 text-slate-100 pb-20">
      
      {/* Top Toggle: Subject Coach vs Live Mock */}
      <div className="bg-[#0D1527] p-1 rounded-2xl border border-indigo-950 flex items-center gap-1 shadow-sm">
        <button
          onClick={() => setActiveTab('coach')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
            activeTab === 'coach'
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>Subject Q&A Coach</span>
        </button>

        <button
          onClick={() => setActiveTab('mock')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
            activeTab === 'mock'
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessagesSquare className="w-3.5 h-3.5" />
          <span>Live Mock Round (3-Q)</span>
        </button>
      </div>

      {activeTab === 'coach' ? (
        /* ================= COACH MODE ================= */
        <div className="space-y-4">
          {/* Subject & Difficulty Selectors */}
          <div className="bg-[#0D1527] border border-indigo-950 rounded-2xl p-3 space-y-3">
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Select Placement Subject
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {SUBJECTS.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubject(sub)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg font-mono font-medium transition cursor-pointer whitespace-nowrap border ${
                      selectedSubject === sub
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                        : 'bg-[#080D1A] text-slate-400 border-indigo-950 hover:text-slate-200'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1 border-t border-indigo-950/80">
              <div className="flex gap-1.5">
                {DIFFICULTIES.map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`text-[10px] px-2 py-0.5 rounded-md font-medium border cursor-pointer transition ${
                      selectedDifficulty === diff
                        ? 'bg-indigo-950 text-indigo-300 border-indigo-600 font-bold'
                        : 'bg-transparent text-slate-500 border-indigo-950 hover:text-slate-300'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>

              <button
                onClick={handleFetchQuestions}
                disabled={isLoadingQuestions}
                className="px-3 py-1 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-90 text-white text-xs font-semibold flex items-center gap-1 shadow-md cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-3 h-3 text-indigo-200" />
                <span>{isLoadingQuestions ? 'Generating...' : 'Get Questions'}</span>
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="text-rose-400 text-xs bg-rose-950/60 border border-rose-800 p-2.5 rounded-xl">
              {errorMessage}
            </div>
          )}

          {/* Active Question Box */}
          {currentCoachQ ? (
            <div className="bg-[#0D1527] border border-indigo-950 rounded-2xl p-4 shadow-xl space-y-3">
              {/* Question Pagination */}
              <div className="flex items-center justify-between text-xs pb-2 border-b border-indigo-950">
                <span className="text-indigo-400 font-bold font-mono">
                  Question {activeQuestionIdx + 1} of {questions.length}
                </span>
                <div className="flex gap-1">
                  {questions.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveQuestionIdx(idx);
                        setEvaluation(null);
                        setStudentAnswer('');
                        setShowHint(false);
                      }}
                      className={`w-6 h-6 rounded-md text-[10px] font-bold cursor-pointer transition ${
                        activeQuestionIdx === idx
                          ? 'bg-indigo-600 text-white'
                          : 'bg-[#080D1A] text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Text */}
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-bold font-mono">
                    {currentCoachQ.subject}
                  </span>
                  <span className="text-[10px] text-slate-400 italic">
                    {currentCoachQ.context}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white leading-snug">
                  {currentCoachQ.question}
                </h3>
              </div>

              {/* Concepts tested & hint */}
              <div className="flex items-center justify-between text-xs pt-1">
                <div className="flex flex-wrap gap-1">
                  {currentCoachQ.keyConcepts?.map((k, i) => (
                    <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-[#080D1A] text-slate-400 border border-indigo-950">
                      {k}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
                </button>
              </div>

              {showHint && currentCoachQ.hint && (
                <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-800/40 text-[11px] text-amber-300 leading-relaxed">
                  💡 <span className="font-semibold">Hint:</span> {currentCoachQ.hint}
                </div>
              )}

              {/* Answer Input Textarea */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-300">
                  Your Answer (Explain logic, complexity, and approach):
                </label>
                <textarea
                  rows={5}
                  value={studentAnswer}
                  onChange={(e) => setStudentAnswer(e.target.value)}
                  placeholder="Type your structured explanation here (e.g. In Floyd's algorithm, we initialize slow and fast pointers...)"
                  className="w-full bg-[#080D1A] border border-indigo-950 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed font-sans"
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-500">
                  {studentAnswer.trim().split(/\s+/).filter(Boolean).length} words
                </span>
                <button
                  onClick={handleEvaluateAnswer}
                  disabled={isEvaluating}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:opacity-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isEvaluating ? 'Evaluating with AI...' : 'Submit & Evaluate Answer'}</span>
                </button>
              </div>

              {/* Evaluation Result Card */}
              {evaluation && (
                <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-[#0F172E] to-[#0A0F1D] border border-indigo-800/70 shadow-lg space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-indigo-950">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-black text-sm">
                        {evaluation.score}/10
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Evaluation Verdict</span>
                        <h4 className="text-xs font-bold text-white">{evaluation.verdict}</h4>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
                      {evaluation.isAiGenerated ? '✨ Gemini AI Feedback' : '🤖 Curated Rubric'}
                    </span>
                  </div>

                  {/* Feedback Details */}
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-semibold text-emerald-400 block mb-0.5">Correctness:</span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{evaluation.correctnessFeedback}</p>
                    </div>

                    <div>
                      <span className="font-semibold text-indigo-400 block mb-0.5">Clarity & Communication:</span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{evaluation.clarityFeedback}</p>
                    </div>

                    {evaluation.keyPointsMissed?.length > 0 && (
                      <div className="bg-rose-950/20 border border-rose-900/40 p-2.5 rounded-xl">
                        <span className="font-semibold text-rose-300 text-[11px] block mb-1">
                          Key Points To Improve / Edge Cases Missed:
                        </span>
                        <ul className="list-disc list-inside space-y-0.5 text-[11px] text-rose-200">
                          {evaluation.keyPointsMissed.map((pt, i) => (
                            <li key={i}>{pt}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Model Answer */}
                    <div className="bg-[#080D1A] border border-indigo-950 p-3 rounded-xl">
                      <span className="font-semibold text-amber-400 text-[11px] block mb-1">
                        🌟 Recommended Placement Model Answer:
                      </span>
                      <p className="text-slate-300 text-[11px] leading-relaxed italic">
                        {evaluation.modelAnswer}
                      </p>
                    </div>

                    {evaluation.tipsForLiveInterview && (
                      <p className="text-[10px] text-indigo-300/80 pt-1">
                        💡 <span className="font-semibold">Live Interview Tip:</span> {evaluation.tipsForLiveInterview}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Empty state prompt */
            <div className="text-center py-12 bg-[#0D1527] rounded-3xl border border-indigo-950 p-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mx-auto">
                <MessagesSquare className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white">Select a Subject to Practice</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Pick a core CS subject above (DSA, DBMS, OS, Computer Networks, SQL) and click "Get Questions" to begin practice.
              </p>
              <button
                onClick={handleFetchQuestions}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer shadow-md"
              >
                Load DSA Questions
              </button>
            </div>
          )}
        </div>
      ) : (
        /* ================= MOCK INTERVIEW MODE ================= */
        <div className="space-y-4">
          {!mockRoundActive ? (
            <div className="bg-gradient-to-br from-[#12182F] via-[#0E1528] to-[#0A0F1E] border border-indigo-900/60 rounded-3xl p-5 text-center space-y-4 shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-600/30">
                <Award className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-base font-extrabold text-white">Full Technical Mock Simulation</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Experience a realistic 3-question campus technical placement interview covering DSA algorithms, DBMS transactions, and Operating Systems.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-left text-xs bg-[#080D1A] p-3 rounded-2xl border border-indigo-950">
                <div className="p-1">
                  <span className="text-[10px] text-indigo-400 font-bold block">ROUND 1</span>
                  <span className="font-semibold text-slate-200">DSA & Algorithms</span>
                </div>
                <div className="p-1 border-l border-indigo-950 pl-2">
                  <span className="text-[10px] text-purple-400 font-bold block">ROUND 2</span>
                  <span className="font-semibold text-slate-200">DBMS & SQL</span>
                </div>
                <div className="p-1 border-l border-indigo-950 pl-2">
                  <span className="text-[10px] text-emerald-400 font-bold block">ROUND 3</span>
                  <span className="font-semibold text-slate-200">OS & Concurrency</span>
                </div>
              </div>

              <button
                onClick={handleStartMockRound}
                disabled={isMockLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{isMockLoading ? 'Setting Up Virtual Interview...' : 'Begin 3-Round Mock Interview'}</span>
              </button>
            </div>
          ) : mockCompleted ? (
            /* Final Report Card */
            <div className="bg-[#0D1527] border border-indigo-900 rounded-3xl p-5 space-y-4 shadow-xl">
              <div className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-extrabold text-white">Mock Interview Scorecard</h3>
                <p className="text-xs text-slate-400">Technical Evaluation Report</p>
              </div>

              {/* Average Score */}
              {mockEvaluations.length > 0 && (
                <div className="bg-[#080D1A] border border-indigo-950 p-4 rounded-2xl flex items-center justify-around">
                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Overall Score</span>
                    <div className="text-2xl font-black text-indigo-400">
                      {(
                        mockEvaluations.reduce((acc, curr) => acc + curr.score, 0) /
                        mockEvaluations.length
                      ).toFixed(1)}
                      <span className="text-xs text-slate-500"> / 10</span>
                    </div>
                  </div>

                  <div className="h-8 w-px bg-indigo-950"></div>

                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Campus Readiness</span>
                    <div className="text-sm font-bold text-emerald-400">
                      {mockEvaluations.every((e) => e.score >= 7) ? 'Tier-1 Ready' : 'Solid Progress'}
                    </div>
                  </div>
                </div>
              )}

              {/* Step By Step Breakdown */}
              <div className="space-y-3">
                {mockEvaluations.map((evalItem, i) => (
                  <div key={i} className="p-3 bg-[#080D1A] rounded-xl border border-indigo-950 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">
                        Question {i + 1}: {mockQuestions[i]?.subject}
                      </span>
                      <span className="font-bold text-indigo-400">{evalItem.score}/10</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">{evalItem.correctnessFeedback}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setMockRoundActive(false)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
              >
                Complete Session & Return
              </button>
            </div>
          ) : (
            /* Live Question In Progress */
            <div className="bg-[#0D1527] border border-indigo-900 rounded-3xl p-4 shadow-xl space-y-3">
              {/* Step Tracker */}
              <div className="flex items-center justify-between text-xs pb-2 border-b border-indigo-950">
                <span className="text-indigo-400 font-bold font-mono">
                  Round {mockCurrentStep + 1} of 3 ({mockQuestions[mockCurrentStep]?.subject})
                </span>
                <span className="text-[10px] text-slate-400">1 question at a time</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-indigo-300 font-mono">
                  {mockQuestions[mockCurrentStep]?.context}
                </span>
                <h4 className="text-sm font-bold text-white">
                  {mockQuestions[mockCurrentStep]?.question}
                </h4>
              </div>

              <textarea
                rows={6}
                value={mockAnswers[mockCurrentStep]}
                onChange={(e) => {
                  const copy = [...mockAnswers];
                  copy[mockCurrentStep] = e.target.value;
                  setMockAnswers(copy);
                }}
                placeholder="Type your complete technical answer..."
                className="w-full bg-[#080D1A] border border-indigo-950 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 leading-relaxed font-sans"
              />

              {errorMessage && (
                <div className="text-rose-400 text-xs bg-rose-950/60 p-2 rounded-xl">
                  {errorMessage}
                </div>
              )}

              <button
                onClick={handleSubmitMockStep}
                disabled={isMockLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isMockLoading ? 'Evaluating Answer...' : mockCurrentStep < 2 ? 'Next Round Question' : 'Complete Mock Round'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
