import React, { useState } from 'react';
import { Plus, Download, Eye, LayoutGrid, Rows, Sparkles, Move } from 'lucide-react';
import { ComicPanel, Character } from '../types/comic';
import { SpeechBubble } from './SpeechBubble';

interface ComicPreviewProps {
  panels: ComicPanel[];
  allCharacters: Character[];
  onAddPanel: () => void;
  onSelectPanel?: (panelId: string) => void;
  onUpdateDialogueText?: (panelId: string, dialogueId: string, newText: string) => void;
  onRepositionDialogue?: (panelId: string, dialogueId: string, x: number, y: number) => void;
  onExportPDF: () => void;
}

export const ComicPreview: React.FC<ComicPreviewProps> = ({
  panels,
  allCharacters,
  onAddPanel,
  onSelectPanel,
  onUpdateDialogueText,
  onRepositionDialogue,
  onExportPDF,
}) => {
  const [layoutMode, setLayoutMode] = useState<'strip' | 'grid'>('strip');
  const [showBubbles, setShowBubbles] = useState(true);

  return (
    <div className="w-80 md:w-96 lg:w-[440px] shrink-0 border-l border-rose-950/40 bg-[#09030b]/80 backdrop-blur-md flex flex-col justify-between overflow-y-auto min-h-[calc(100vh-45px)] select-none">
      <div className="p-4 space-y-4">
        {/* Header Bar */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white tracking-wide">
            Comic Preview
          </h2>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setLayoutMode(layoutMode === 'strip' ? 'grid' : 'strip')}
              title={layoutMode === 'strip' ? 'Switch to 2x2 Grid' : 'Switch to Vertical Strip'}
              className="p-1 rounded text-zinc-400 hover:text-white hover:bg-white/5 border border-zinc-800 transition-colors"
            >
              {layoutMode === 'strip' ? (
                <Rows className="w-3.5 h-3.5" />
              ) : (
                <LayoutGrid className="w-3.5 h-3.5" />
              )}
            </button>

            <button
              onClick={onExportPDF}
              title="Quick Export PDF"
              className="p-1 rounded text-rose-400 hover:text-white hover:bg-rose-900/40 border border-rose-900/60 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Comic Panels Container */}
        <div
          id="comic-preview-canvas"
          className={
            layoutMode === 'grid'
              ? 'grid grid-cols-2 gap-3.5'
              : 'space-y-4'
          }
        >
          {panels.map((panel, pIdx) => {
            return (
              <div
                key={panel.id}
                onClick={() => onSelectPanel && onSelectPanel(panel.id)}
                className="relative group rounded-lg overflow-hidden border-[6px] border-white shadow-2xl bg-black cursor-pointer transition-transform duration-150"
              >
                {/* Panel Artwork Image */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-950">
                  {panel.imageUrl ? (
                    <img
                      src={panel.imageUrl}
                      alt={`Panel ${pIdx + 1}`}
                      className="w-full h-full object-cover select-none pointer-events-none"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-zinc-500">
                      <Sparkles className="w-8 h-8 text-rose-500 mb-2 animate-pulse" />
                      <div className="text-xs font-semibold text-zinc-300">
                        Rendering Panel {pIdx + 1}...
                      </div>
                    </div>
                  )}

                  {/* Speech Bubbles Layer */}
                  {showBubbles &&
                    panel.dialogues.map((diag) => (
                      <SpeechBubble
                        key={diag.id}
                        dialogue={diag}
                        isEditable={true}
                        onUpdateText={(newText) => {
                          if (onUpdateDialogueText) {
                            onUpdateDialogueText(panel.id, diag.id, newText);
                          }
                        }}
                      />
                    ))}

                  {/* Subtle Panel Number Tag in corner */}
                  <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[9px] font-mono font-bold text-zinc-300 border border-white/10 opacity-70 group-hover:opacity-100 transition-opacity">
                    #{pIdx + 1}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom "+ Add Panel" Button matching screenshot */}
        <button
          onClick={onAddPanel}
          className="w-full py-2.5 px-4 rounded-lg border border-rose-800/80 hover:border-rose-600 bg-rose-950/20 hover:bg-rose-900/40 text-rose-300 hover:text-white font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Add Panel</span>
        </button>
      </div>
    </div>
  );
};
