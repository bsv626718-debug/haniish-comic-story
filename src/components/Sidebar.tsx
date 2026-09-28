import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Plus, Users, Edit3, Trash2, Check, Shield } from 'lucide-react';
import { ComicProject, Character } from '../types/comic';

interface SidebarProps {
  project: ComicProject;
  activeStoryId: string;
  onSelectStory: (storyId: string) => void;
  onAddStory: () => void;
  onUpdateTitle: (newTitle: string) => void;
  onOpenCharacterModal: (character?: Character) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  project,
  activeStoryId,
  onSelectStory,
  onAddStory,
  onUpdateTitle,
  onOpenCharacterModal,
}) => {
  const [storiesExpanded, setStoriesExpanded] = useState(true);
  const [charactersExpanded, setCharactersExpanded] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(project.title);

  const handleTitleSubmit = () => {
    if (titleInput.trim()) {
      onUpdateTitle(titleInput.trim());
    }
    setIsEditingTitle(false);
  };

  return (
    <aside className="w-64 md:w-72 shrink-0 flex flex-col justify-between border-r border-rose-950/40 bg-[#0a040b]/85 backdrop-blur-md select-none overflow-y-auto min-h-[calc(100vh-45px)]">
      <div className="p-4 space-y-6">
        {/* COMIC TITLE */}
        <div>
          <div className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
            COMIC TITLE
          </div>
          {isEditingTitle ? (
            <div className="mt-1 flex items-center gap-1.5">
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
                autoFocus
                className="w-full bg-[#170a1a] border border-rose-600 rounded px-2 py-1 text-sm font-bold text-white focus:outline-none"
              />
              <button
                onClick={handleTitleSubmit}
                className="p-1.5 bg-rose-600 hover:bg-rose-500 rounded text-white"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => setIsEditingTitle(true)}
              className="group cursor-pointer mt-1"
              title="Click to rename comic"
            >
              <h1 className="text-2xl font-black text-white tracking-tight leading-none group-hover:text-rose-200 transition-colors flex items-start justify-between">
                <span>{project.title}</span>
                <Edit3 className="w-3.5 h-3.5 text-zinc-600 group-hover:text-rose-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h1>
            </div>
          )}
        </div>

        {/* Stories Section */}
        <div className="space-y-3">
          <div
            onClick={() => setStoriesExpanded(!storiesExpanded)}
            className="flex items-center justify-between cursor-pointer group py-1 border-b border-zinc-900"
          >
            <span className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">
              Stories
            </span>
            <button className="text-zinc-500 group-hover:text-zinc-300">
              {storiesExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>

          {storiesExpanded && (
            <div className="space-y-2 pt-1 animate-in fade-in duration-200">
              {project.stories.map((story, index) => {
                const isActive = story.id === activeStoryId;
                return (
                  <div
                    key={story.id}
                    onClick={() => onSelectStory(story.id)}
                    className={`cursor-pointer px-3 py-2.5 rounded-lg transition-all border ${
                      isActive
                        ? 'bg-rose-950/30 border-rose-800/60 shadow-[0_0_12px_rgba(225,29,72,0.15)] text-white'
                        : 'bg-[#120715]/40 border-transparent hover:border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <div className="text-[10px] font-bold tracking-wider uppercase text-zinc-400">
                      STORY {index + 1}
                    </div>
                    <div className="text-sm font-semibold text-zinc-100 truncate mt-0.5">
                      {story.title}
                    </div>
                  </div>
                );
              })}

              {/* + Add New Story Button */}
              <button
                onClick={onAddStory}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-rose-800/60 hover:border-rose-600 bg-rose-950/20 hover:bg-rose-900/30 text-rose-300 hover:text-white text-xs font-semibold tracking-wide transition-all mt-2"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add New Story</span>
              </button>
            </div>
          )}
        </div>

        {/* Characters Section Accordion */}
        <div className="space-y-3">
          <div
            onClick={() => setCharactersExpanded(!charactersExpanded)}
            className="flex items-center justify-between cursor-pointer group py-1 border-b border-zinc-900"
          >
            <span className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">
              Characters
            </span>
            <button className="text-zinc-500 group-hover:text-zinc-300">
              {charactersExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>

          {charactersExpanded && (
            <div className="space-y-2 pt-1 animate-in fade-in duration-200">
              {project.characters.map((char) => (
                <div
                  key={char.id}
                  onClick={() => onOpenCharacterModal(char)}
                  className="flex items-center gap-2.5 p-2 rounded-lg bg-[#140818]/60 border border-zinc-800/60 hover:border-rose-800/60 cursor-pointer transition-all group"
                >
                  <img
                    src={char.avatar}
                    alt={char.name}
                    className="w-8 h-8 rounded-full border border-rose-900/60 object-cover bg-zinc-900"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-zinc-200 group-hover:text-rose-300 truncate">
                      {char.name}
                    </div>
                    <div className="text-[10px] text-zinc-400 truncate">
                      {char.role}
                    </div>
                  </div>
                  <Edit3 className="w-3.5 h-3.5 text-zinc-600 group-hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}

              <button
                onClick={() => onOpenCharacterModal()}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg border border-dashed border-zinc-800 hover:border-rose-700 text-zinc-400 hover:text-rose-300 text-xs font-medium transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Character</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer matching screenshot: COMAZI - VERSION 1.0 \n PRIVACY POLICY · TERMS OF USE */}
      <div className="p-4 border-t border-rose-950/30 text-[10px] text-zinc-500 font-mono tracking-wider space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-bold text-zinc-400">COMAZI</span>
          <span className="text-zinc-600">•</span>
          <span>VERSION 1.0</span>
        </div>
        <div className="flex items-center gap-2 text-[9px] text-zinc-400">
          <a href="#privacy" className="hover:text-zinc-300 transition-colors">
            PRIVACY POLICY
          </a>
          <span>•</span>
          <a href="#terms" className="hover:text-zinc-300 transition-colors">
            TERMS OF USE
          </a>
        </div>
      </div>
    </aside>
  );
};
