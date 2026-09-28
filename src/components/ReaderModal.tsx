import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2, ZoomIn, ZoomOut } from 'lucide-react';
import { ComicProject } from '../types/comic';
import { SpeechBubble } from './SpeechBubble';

interface ReaderModalProps {
  project: ComicProject;
  isOpen: boolean;
  onClose: () => void;
}

export const ReaderModal: React.FC<ReaderModalProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const activeStory =
    project.stories.find((s) => s.id === project.activeStoryId) ||
    project.stories[0];
  const panels = activeStory?.panels || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentPanel = panels[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black text-white select-none animate-in fade-in duration-200">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
        <div>
          <h2 className="text-sm font-bold text-white tracking-wide">
            {project.title}
          </h2>
          <div className="text-[11px] text-zinc-400">
            Chapter: {activeStory?.title} · Panel {currentIndex + 1} of {panels.length}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Panel Viewport */}
      <div className="flex-1 relative flex items-center justify-center p-4 md:p-8 overflow-hidden">
        {currentPanel ? (
          <div className="relative max-h-[85vh] aspect-[3/4] rounded-lg overflow-hidden border-[8px] border-white shadow-[0_0_50px_rgba(0,0,0,0.9)] bg-black">
            <img
              src={currentPanel.imageUrl}
              alt={`Panel ${currentIndex + 1}`}
              className="w-full h-full object-cover"
            />
            {currentPanel.dialogues.map((diag) => (
              <SpeechBubble key={diag.id} dialogue={diag} />
            ))}
          </div>
        ) : (
          <div className="text-zinc-500 text-sm">No panels available.</div>
        )}

        {/* Previous Button */}
        {currentIndex > 0 && (
          <button
            onClick={() => setCurrentIndex((prev) => prev - 1)}
            className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-zinc-900/80 hover:bg-rose-600 text-white shadow-xl transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Next Button */}
        {currentIndex < panels.length - 1 && (
          <button
            onClick={() => setCurrentIndex((prev) => prev + 1)}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-zinc-900/80 hover:bg-rose-600 text-white shadow-xl transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Bottom Thumbnails Strip */}
      <div className="flex items-center justify-center gap-3 py-3 border-t border-zinc-900 bg-zinc-950/80 px-4 overflow-x-auto">
        {panels.map((p, idx) => (
          <button
            key={p.id}
            onClick={() => setCurrentIndex(idx)}
            className={`relative w-12 h-16 rounded overflow-hidden border-2 transition-all ${
              idx === currentIndex
                ? 'border-rose-500 scale-105 shadow-md shadow-rose-950'
                : 'border-zinc-800 opacity-60 hover:opacity-100'
            }`}
          >
            {p.imageUrl && (
              <img
                src={p.imageUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            )}
            <span className="absolute bottom-0 right-0 bg-black/80 text-[8px] font-mono px-1">
              #{idx + 1}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
