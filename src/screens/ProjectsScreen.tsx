import React, { useState } from 'react';
import {
  FolderGit2,
  Plus,
  Github,
  ExternalLink,
  Sparkles,
  Trash2,
  Copy,
  Check,
  Award,
  ChevronDown,
  ChevronUp,
  FileText,
} from 'lucide-react';
import { ProjectItem } from '../types';
import { enhanceProjectApi } from '../services/api';

interface ProjectsScreenProps {
  projects: ProjectItem[];
  onAddProject: (project: ProjectItem) => void;
  onDeleteProject: (id: string) => void;
}

export const ProjectsScreen: React.FC<ProjectsScreenProps> = ({
  projects,
  onAddProject,
  onDeleteProject,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(projects[0]?.id || null);
  const [copiedBulletId, setCopiedBulletId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [roughDescription, setRoughDescription] = useState('');
  const [outcome, setOutcome] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [formError, setFormError] = useState('');

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Please enter a project title.');
      return;
    }

    setIsEnhancing(true);
    setFormError('');

    try {
      const techArray = technologies.split(',').map((t) => t.trim()).filter(Boolean);
      
      // Call AI enhancement API
      const aiResponse = await enhanceProjectApi({
        title,
        problemStatement,
        technologies: techArray,
        roughDescription,
        outcome,
      });

      const newProj: ProjectItem = {
        id: `proj-${Date.now()}`,
        title: title.trim(),
        problemStatement: problemStatement.trim(),
        technologies: techArray.length > 0 ? techArray : ['React', 'Python'],
        roughDescription: roughDescription.trim(),
        outcome: outcome.trim(),
        githubUrl: githubUrl.trim() || undefined,
        starBullets: aiResponse.resumeBulletPoints,
        improvedSummary: aiResponse.oneLineSummary,
        vivaTalkingPoints: aiResponse.vivaTalkingPoints,
        createdDate: new Date().toISOString().split('T')[0],
      };

      onAddProject(newProj);
      setTitle('');
      setProblemStatement('');
      setTechnologies('');
      setRoughDescription('');
      setOutcome('');
      setGithubUrl('');
      setIsAddModalOpen(false);
    } catch (err: any) {
      setFormError('Failed to optimize project bullets. Saved with standard format.');
    } finally {
      setIsEnhancing(false);
    }
  };

  const copyBullet = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBulletId(id);
    setTimeout(() => setCopiedBulletId(null), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 text-slate-100 pb-20">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#12182F] via-[#0E1528] to-[#0A0F1E] border border-indigo-900/60 rounded-3xl p-4 shadow-xl flex items-center justify-between">
        <div>
          <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider block mb-1">
            STAR Method Portfolio Builder
          </span>
          <h2 className="text-base font-extrabold text-white">Engineering Project Showcase</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Turn college assignments into high-impact ATS resume bullet points.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-90 text-white text-xs font-semibold flex items-center gap-1 shadow-md cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Projects List */}
      <div className="space-y-3">
        {projects.map((proj) => {
          const isExpanded = expandedProjectId === proj.id;

          return (
            <div
              key={proj.id}
              className={`bg-[#0D1527] border rounded-2xl overflow-hidden transition-all duration-200 shadow-md ${
                isExpanded ? 'border-indigo-700/80' : 'border-indigo-950/80'
              }`}
            >
              {/* Project Card Header */}
              <div className="p-3.5 flex items-start justify-between">
                <div
                  className="flex-1 pr-2 cursor-pointer"
                  onClick={() => setExpandedProjectId(isExpanded ? null : proj.id)}
                >
                  <div className="flex flex-wrap gap-1 mb-1.5">
                    {proj.technologies.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-950/90 text-indigo-300 border border-indigo-900 font-mono"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-xs font-bold text-white tracking-tight">{proj.title}</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                    {proj.problemStatement || proj.roughDescription}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-[#080D1A] text-slate-400 hover:text-white border border-indigo-950 transition"
                      title="View GitHub Repository"
                    >
                      <Github className="w-3.5 h-3.5" />
                    </a>
                  )}

                  <button
                    onClick={() => onDeleteProject(proj.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition cursor-pointer"
                    title="Delete project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setExpandedProjectId(isExpanded ? null : proj.id)}
                    className="p-1 text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expanded STAR Bullets & Viva Points */}
              {isExpanded && (
                <div className="p-3.5 pt-0 border-t border-indigo-950 space-y-3 mt-1">
                  {/* STAR Resume Bullets */}
                  {proj.starBullets && proj.starBullets.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        STAR Resume Bullets (Action Verb + Metric)
                      </span>
                      <div className="space-y-1.5">
                        {proj.starBullets.map((bullet, idx) => (
                          <div
                            key={idx}
                            className="p-2 rounded-xl bg-[#080D1A] border border-indigo-950 text-xs text-slate-200 flex items-start justify-between gap-2"
                          >
                            <span className="flex-1 text-[11px] leading-relaxed">
                              • {bullet}
                            </span>
                            <button
                              onClick={() => copyBullet(bullet, `${proj.id}-${idx}`)}
                              className="text-slate-500 hover:text-indigo-400 transition cursor-pointer shrink-0 mt-0.5"
                              title="Copy bullet point"
                            >
                              {copiedBulletId === `${proj.id}-${idx}` ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Viva / Interview Defense Talking Points */}
                  {proj.vivaTalkingPoints && proj.vivaTalkingPoints.length > 0 && (
                    <div className="bg-violet-950/20 border border-violet-900/40 p-2.5 rounded-xl space-y-1">
                      <span className="text-[11px] font-bold text-violet-300 block">
                        🎓 Viva Voce & Technical Defense Talking Points:
                      </span>
                      <ul className="list-disc list-inside space-y-0.5 text-[10px] text-violet-200">
                        {proj.vivaTalkingPoints.map((pt, idx) => (
                          <li key={idx}>{pt}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Project Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto">
          <div className="w-full max-w-md bg-[#0D1527] border border-indigo-900 rounded-3xl p-5 shadow-2xl text-slate-100 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <FolderGit2 className="w-4 h-4 text-indigo-400" />
              Add Project with AI STAR Optimization
            </h3>

            {formError && (
              <div className="text-rose-400 text-xs bg-rose-950/60 p-2 rounded-xl">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateProject} className="space-y-2.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Project Title</label>
                <input
                  type="text"
                  placeholder="e.g. Distributed Task Queue"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#080D1A] border border-indigo-950 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Problem Statement</label>
                <input
                  type="text"
                  placeholder="What real problem does this application solve?"
                  value={problemStatement}
                  onChange={(e) => setProblemStatement(e.target.value)}
                  className="w-full bg-[#080D1A] border border-indigo-950 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Technologies Used (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="Python, FastAPI, Redis, React, Docker"
                  value={technologies}
                  onChange={(e) => setTechnologies(e.target.value)}
                  className="w-full bg-[#080D1A] border border-indigo-950 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Rough Description / Architecture</label>
                <textarea
                  rows={3}
                  placeholder="Describe how it was built, concurrency, database schema..."
                  value={roughDescription}
                  onChange={(e) => setRoughDescription(e.target.value)}
                  className="w-full bg-[#080D1A] border border-indigo-950 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Outcome / Metric / Results</label>
                <input
                  type="text"
                  placeholder="e.g. Cut processing time by 45%, handled 500+ requests/sec"
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value)}
                  className="w-full bg-[#080D1A] border border-indigo-950 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">GitHub Repository Link</label>
                <input
                  type="url"
                  placeholder="https://github.com/username/project"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full bg-[#080D1A] border border-indigo-950 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-indigo-500 font-mono"
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
                  disabled={isEnhancing}
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-95 text-white font-semibold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                  <span>{isEnhancing ? 'Generating STAR Bullets...' : 'Save & Optimize'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
