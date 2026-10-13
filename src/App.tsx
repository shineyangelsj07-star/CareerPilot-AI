import React, { useState, useEffect } from 'react';
import {
  StudentProfile,
  RoadmapData,
  CodingProblem,
  ProjectItem,
} from './types';
import {
  loadProfile,
  saveProfile,
  loadCompletedTopics,
  saveCompletedTopics,
  loadSavedRoadmap,
  saveRoadmap,
  loadProblems,
  saveProblems,
  loadProjects,
  saveProjects,
  loadViewMode,
  saveViewMode,
  resetDemoData,
  DEFAULT_PROFILE,
} from './services/storage';
import { fetchApiStatus, generateRoadmapApi, ApiStatus } from './services/api';
import { AndroidFrame } from './components/AndroidFrame';
import { Header } from './components/Header';
import { Navigation, ActiveTab } from './components/Navigation';
import { OnboardingModal } from './components/OnboardingModal';
import { HomeScreen } from './screens/HomeScreen';
import { RoadmapScreen } from './screens/RoadmapScreen';
import { PracticeScreen } from './screens/PracticeScreen';
import { InterviewScreen } from './screens/InterviewScreen';
import { ProjectsScreen } from './screens/ProjectsScreen';
import { ResumeJdScreen } from './screens/ResumeJdScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { CollegeDocsScreen } from './screens/CollegeDocsScreen';

export default function App() {
  const [profile, setProfile] = useState<StudentProfile>(loadProfile);
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(loadSavedRoadmap);
  const [completedTopicIds, setCompletedTopicIds] = useState<string[]>(loadCompletedTopics);
  const [problems, setProblems] = useState<CodingProblem[]>(loadProblems);
  const [projects, setProjects] = useState<ProjectItem[]>(loadProjects);
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [viewMode, setViewMode] = useState<'mobile' | 'expanded'>(loadViewMode);
  const [isCollegeDocsOpen, setIsCollegeDocsOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(!profile.isOnboarded);
  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null);

  // Resume / JD sub-mode when triggered from quick actions
  const [resumeJdMode, setResumeJdMode] = useState<'resume' | 'jd'>('resume');
  const [isResumeJdModalOpen, setIsResumeJdModalOpen] = useState(false);

  // Initial backend check and initial roadmap fallback generator
  useEffect(() => {
    fetchApiStatus().then(setApiStatus);

    if (!roadmap) {
      generateRoadmapApi({
        name: profile.name,
        branch: profile.branch,
        yearOfStudy: profile.yearOfStudy,
        targetRole: profile.targetRole,
        technicalSkills: profile.technicalSkills,
        dailyStudyHours: profile.dailyStudyHours,
        currentProficiency: profile.currentProficiency,
      })
        .then((data) => {
          setRoadmap(data);
          saveRoadmap(data);
        })
        .catch((err) => {
          console.warn('Initial roadmap generation fallback', err);
        });
    }
  }, []);

  // Save changes to localStorage
  const handleUpdateProfile = (newProfile: StudentProfile) => {
    setProfile(newProfile);
    saveProfile(newProfile);
  };

  const handleUpdateRoadmap = (newRoadmap: RoadmapData) => {
    setRoadmap(newRoadmap);
    saveRoadmap(newRoadmap);
  };

  const handleToggleTopic = (topicId: string) => {
    let updated: string[];
    if (completedTopicIds.includes(topicId)) {
      updated = completedTopicIds.filter((id) => id !== topicId);
    } else {
      updated = [...completedTopicIds, topicId];
    }
    setCompletedTopicIds(updated);
    saveCompletedTopics(updated);
  };

  const handleAddProblem = (newProblem: CodingProblem) => {
    const updated = [newProblem, ...problems];
    setProblems(updated);
    saveProblems(updated);

    // Increase streak if solved today
    const updatedProfile = {
      ...profile,
      streakDays: profile.streakDays + 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
    };
    handleUpdateProfile(updatedProfile);
  };

  const handleDeleteProblem = (id: string) => {
    const updated = problems.filter((p) => p.id !== id);
    setProblems(updated);
    saveProblems(updated);
  };

  const handleAddProject = (newProject: ProjectItem) => {
    const updated = [newProject, ...projects];
    setProjects(updated);
    saveProjects(updated);
  };

  const handleDeleteProject = (id: string) => {
    const updated = projects.filter((p) => p.id !== id);
    setProjects(updated);
    saveProjects(updated);
  };

  const handleToggleViewMode = () => {
    const nextMode = viewMode === 'mobile' ? 'expanded' : 'mobile';
    setViewMode(nextMode);
    saveViewMode(nextMode);
  };

  const handleResetData = () => {
    resetDemoData();
    setProfile({ ...DEFAULT_PROFILE, isOnboarded: false });
    setCompletedTopicIds(['w1-t1']);
    setProblems([]);
    setProjects([]);
    setRoadmap(null);
    setIsOnboardingOpen(true);
    setActiveTab('home');
  };

  return (
    <AndroidFrame viewMode={viewMode} onToggleViewMode={handleToggleViewMode}>
      {/* Top Application Bar */}
      <Header
        profile={profile}
        apiStatus={apiStatus}
        onOpenCollegeDocs={() => setIsCollegeDocsOpen(true)}
        onOpenProfile={() => setActiveTab('profile')}
      />

      {/* Screen Router */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {activeTab === 'home' && (
          <HomeScreen
            profile={profile}
            problems={problems}
            roadmap={roadmap}
            completedTopicIds={completedTopicIds}
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenCollegeDocs={() => setIsCollegeDocsOpen(true)}
            onOpenResumeATS={() => {
              setResumeJdMode('resume');
              setIsResumeJdModalOpen(true);
            }}
            onOpenJdMatcher={() => {
              setResumeJdMode('jd');
              setIsResumeJdModalOpen(true);
            }}
            onToggleTopic={handleToggleTopic}
          />
        )}

        {activeTab === 'roadmap' && (
          <RoadmapScreen
            profile={profile}
            roadmap={roadmap}
            completedTopicIds={completedTopicIds}
            onToggleTopic={handleToggleTopic}
            onUpdateRoadmap={handleUpdateRoadmap}
          />
        )}

        {activeTab === 'practice' && (
          <PracticeScreen
            problems={problems}
            streakDays={profile.streakDays}
            onAddProblem={handleAddProblem}
            onDeleteProblem={handleDeleteProblem}
          />
        )}

        {activeTab === 'interview' && <InterviewScreen />}

        {activeTab === 'projects' && (
          <ProjectsScreen
            projects={projects}
            onAddProject={handleAddProject}
            onDeleteProject={handleDeleteProject}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileScreen
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            onResetDemoData={handleResetData}
          />
        )}
      </div>

      {/* Bottom Android Navigation Bar */}
      <Navigation activeTab={activeTab} onSelectTab={(tab) => setActiveTab(tab)} />

      {/* Onboarding Wizard Modal */}
      <OnboardingModal
        initialProfile={profile}
        isOpen={isOnboardingOpen}
        onComplete={(newProfile) => {
          handleUpdateProfile(newProfile);
          setIsOnboardingOpen(false);
          // Trigger tailored roadmap generation
          generateRoadmapApi({
            name: newProfile.name,
            branch: newProfile.branch,
            yearOfStudy: newProfile.yearOfStudy,
            targetRole: newProfile.targetRole,
            technicalSkills: newProfile.technicalSkills,
            dailyStudyHours: newProfile.dailyStudyHours,
            currentProficiency: newProfile.currentProficiency,
          }).then(handleUpdateRoadmap);
        }}
      />

      {/* College Project Documentation & Viva Voce Modal */}
      <CollegeDocsScreen
        isOpen={isCollegeDocsOpen}
        onClose={() => setIsCollegeDocsOpen(false)}
      />

      {/* Resume ATS & JD Matcher Standalone Modal */}
      {isResumeJdModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3">
          <div className="w-full max-w-xl bg-[#0B1224] border border-indigo-900 rounded-3xl shadow-2xl text-slate-100 flex flex-col max-h-[90vh] overflow-hidden">
            <div className="p-3 bg-[#0E162B] border-b border-indigo-950 flex items-center justify-between">
              <span className="text-xs font-bold text-white">CareerPilot AI Placement Tools</span>
              <button
                onClick={() => setIsResumeJdModalOpen(false)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs hover:text-white cursor-pointer"
              >
                Close
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ResumeJdScreen profile={profile} initialMode={resumeJdMode} />
            </div>
          </div>
        </div>
      )}
    </AndroidFrame>
  );
}
