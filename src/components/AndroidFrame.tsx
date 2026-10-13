import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Wifi, BatteryCharging, Signal } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  viewMode: 'mobile' | 'expanded';
  onToggleViewMode: () => void;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  viewMode,
  onToggleViewMode,
}) => {
  const [currentTime, setCurrentTime] = useState('10:42');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  if (viewMode === 'expanded') {
    return (
      <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col items-center">
        {/* Top View Mode Switcher Header for Desktop */}
        <header className="w-full bg-[#0D1527] border-b border-indigo-950/60 px-4 py-2 flex items-center justify-between text-xs sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-slate-300">Android Full-Screen Mode</span>
            <span className="text-slate-500 hidden sm:inline">| Responsive Tablet / Desktop View</span>
          </div>
          <button
            onClick={onToggleViewMode}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 border border-indigo-700/50 transition cursor-pointer"
            title="Switch to Android Phone Device Frame"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Switch to Android Phone Frame</span>
          </button>
        </header>

        <main className="w-full max-w-4xl flex-1 flex flex-col shadow-2xl bg-[#090E1A]">
          {children}
        </main>
      </div>
    );
  }

  // Mobile Device Frame Mode
  return (
    <div className="min-h-screen bg-[#060A12] text-slate-100 flex flex-col items-center justify-start sm:py-6 sm:px-4">
      {/* Device Frame Toolbar */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-[430px] mb-3 px-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
          <span className="font-medium text-slate-300">CareerPilot Android Preview</span>
        </div>
        <button
          onClick={onToggleViewMode}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer text-[11px]"
          title="Switch to full screen layout"
        >
          <Monitor className="w-3.5 h-3.5 text-indigo-400" />
          <span>Expand View</span>
        </button>
      </div>

      {/* Android Device Body (Pixel 8 / Galaxy S24 Aspect Ratio) */}
      <div className="w-full sm:max-w-[420px] h-screen sm:h-[880px] bg-[#090E1A] sm:rounded-[46px] sm:border-[8px] sm:border-[#1E293B] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_30px_rgba(99,102,241,0.15)] flex flex-col overflow-hidden relative sm:ring-1 sm:ring-slate-700/50">
        
        {/* Android Punch Hole Camera Notch */}
        <div className="w-full h-8 bg-[#090E1A] flex items-center justify-between px-6 pt-1 text-[12px] font-medium text-slate-300 select-none z-40 shrink-0">
          {/* Status Bar Left: Clock */}
          <span>{currentTime}</span>

          {/* Camera Notch Center */}
          <div className="w-4 h-4 bg-black rounded-full ring-2 ring-slate-800/80 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-blue-950/80 rounded-full"></div>
          </div>

          {/* Status Bar Right: 5G, Wifi, Battery */}
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-[10px] font-semibold tracking-wider text-indigo-400">5G</span>
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <div className="flex items-center gap-0.5">
              <span className="text-[10px]">94%</span>
              <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Device Screen Content */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {children}
        </div>

        {/* Android Bottom Gesture Navigation Pill */}
        <div className="w-full h-4 bg-[#090E1A] flex items-center justify-center shrink-0 z-40">
          <div className="w-32 h-1 bg-slate-600/70 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
