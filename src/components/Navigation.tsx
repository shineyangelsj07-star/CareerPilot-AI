import React from 'react';
import { Home, Compass, Code2, MessagesSquare, FolderGit2, User } from 'lucide-react';

export type ActiveTab = 'home' | 'roadmap' | 'practice' | 'interview' | 'projects' | 'profile';

interface NavigationProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onSelectTab }) => {
  const tabs = [
    { id: 'home' as ActiveTab, label: 'Home', icon: Home },
    { id: 'roadmap' as ActiveTab, label: 'Roadmap', icon: Compass },
    { id: 'practice' as ActiveTab, label: 'Practice', icon: Code2 },
    { id: 'interview' as ActiveTab, label: 'Coach', icon: MessagesSquare },
    { id: 'projects' as ActiveTab, label: 'Projects', icon: FolderGit2 },
    { id: 'profile' as ActiveTab, label: 'Profile', icon: User },
  ];

  return (
    <nav className="w-full bg-[#0D1527]/95 backdrop-blur-md border-t border-indigo-950/80 px-2 py-1.5 flex items-center justify-around shrink-0 z-30 select-none shadow-[0_-8px_20px_rgba(0,0,0,0.4)]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all duration-200 cursor-pointer relative ${
              isActive
                ? 'text-indigo-300'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {/* Android Active Indicator Pill */}
            <div
              className={`w-12 h-7 rounded-full flex items-center justify-center transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'scale-110' : ''}`} />
            </div>
            <span
              className={`text-[10px] mt-0.5 tracking-tight font-medium ${
                isActive ? 'text-indigo-200 font-semibold' : 'text-slate-400'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
