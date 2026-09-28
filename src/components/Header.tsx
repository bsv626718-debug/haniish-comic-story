import React, { useState } from 'react';
import { Home, ChevronDown, CloudCheck, Share2, Maximize2, Sparkles, FolderPlus, BookOpen } from 'lucide-react';
import { ComicProject } from '../types/comic';

interface HeaderProps {
  project: ComicProject;
  activeTab: 'story' | 'panels';
  setActiveTab: (tab: 'story' | 'panels') => void;
  onShare: () => void;
  onExport: () => void;
  onNewProject: () => void;
  onOpenProjectList: () => void;
  isSaving?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  project,
  activeTab,
  setActiveTab,
  onShare,
  onExport,
  onNewProject,
  onOpenProjectList,
  isSaving = false,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="relative z-30 flex items-center justify-between px-4 py-2.5 bg-[#09030a]/90 backdrop-blur-md border-b border-rose-950/40 select-none">
      {/* Left: Home & Comics Dropdown */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveTab('panels')}
          title="Home"
          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors border border-transparent hover:border-zinc-800"
        >
          <Home className="w-4 h-4" />
        </button>

        <div className="h-4 w-[1px] bg-zinc-800" />

        {/* ComicCraft Stylized Logo & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-2.5 py-1 rounded-md text-zinc-200 hover:text-white hover:bg-white/5 transition-colors group"
          >
            {/* Red/Crimson Stylized C Logo */}
            <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-tr from-rose-700 to-pink-600 shadow-sm shadow-rose-900/40 text-white font-extrabold text-sm tracking-tighter">
              <span>C</span>
              <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-rose-300 rounded-full" />
            </div>

            <span className="font-semibold text-sm tracking-wide text-zinc-100 flex items-center gap-1.5">
              Comics
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-200 transition-transform duration-200" />
            </span>
          </button>

          {/* Comics Menu Dropdown */}
          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute left-0 mt-2 w-64 rounded-xl bg-[#120716] border border-rose-950/70 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2 py-1.5 text-[11px] font-semibold text-rose-400 uppercase tracking-wider">
                  Current Comic
                </div>
                <div className="px-2.5 py-2 rounded-lg bg-rose-950/30 border border-rose-800/40 mb-2">
                  <div className="font-bold text-xs text-white truncate">{project.title}</div>
                  <div className="text-[10px] text-zinc-400">{project.genre} · {project.stories.length} Chapters</div>
                </div>

                <div className="h-[1px] bg-zinc-800/80 my-1" />

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onNewProject();
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-rose-900/30 transition-colors"
                >
                  <FolderPlus className="w-3.5 h-3.5 text-rose-400" />
                  <span>Create New Comic</span>
                </button>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onExport();
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-rose-900/30 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5 text-rose-400" />
                  <span>Export Comic Book (PDF/PNG)</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Center: Story | Panels Tab Switcher with Red Underline Indicator */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => setActiveTab('story')}
          className={`relative py-1 text-sm font-medium transition-colors ${
            activeTab === 'story'
              ? 'text-white font-bold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Story
          {activeTab === 'story' && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-rose-500 to-pink-500 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
          )}
        </button>

        <span className="text-zinc-600 text-xs">|</span>

        <button
          onClick={() => setActiveTab('panels')}
          className={`relative py-1 text-sm font-medium transition-colors ${
            activeTab === 'panels'
              ? 'text-white font-bold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Panels
          {activeTab === 'panels' && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-rose-500 to-pink-500 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
          )}
        </button>
      </div>

      {/* Right: Autosave status, Share, Fullscreen, User Avatar */}
      <div className="flex items-center gap-3">
        {/* Autosaved Cloud */}
        <div
          title={isSaving ? 'Saving changes...' : 'All changes saved to cloud'}
          className="flex items-center gap-1.5 text-zinc-400 text-xs px-2 py-1"
        >
          <CloudCheck className={`w-4 h-4 ${isSaving ? 'animate-pulse text-amber-400' : 'text-zinc-400'}`} />
        </div>

        {/* Share Button with Red Accent */}
        <button
          onClick={onShare}
          className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold text-rose-200 hover:text-white bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/50 hover:border-rose-600 transition-all shadow-sm"
        >
          <Share2 className="w-3.5 h-3.5 text-rose-400" />
          <span>Share</span>
        </button>

        {/* Reader / Fullscreen */}
        <button
          onClick={onExport}
          title="Comic Reader / Export"
          className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-white/5 border border-zinc-800/80 transition-colors"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>

        {/* User Profile Avatar with glowing crimson border ring */}
        <div
          title="ComicCraft Creator"
          className="relative w-7 h-7 rounded-full p-[1.5px] bg-gradient-to-tr from-rose-600 via-pink-600 to-amber-500 cursor-pointer shadow-[0_0_10px_rgba(225,29,72,0.4)] hover:scale-105 transition-transform"
        >
          <div className="w-full h-full rounded-full bg-[#1b081e] flex items-center justify-center overflow-hidden">
            <span className="text-[11px] font-bold text-rose-200">CC</span>
          </div>
          <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-black" />
        </div>
      </div>
    </header>
  );
};
