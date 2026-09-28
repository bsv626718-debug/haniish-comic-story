import React, { useState } from 'react';
import {
  ChevronUp,
  ChevronDown,
  Sparkles,
  Maximize,
  MoreVertical,
  Edit2,
  Plus,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Loader2,
  UserPlus,
  MessageSquarePlus,
  Check,
} from 'lucide-react';
import { ComicPanel, Character, Dialogue } from '../types/comic';

interface PanelsWorkspaceProps {
  panels: ComicPanel[];
  allCharacters: Character[];
  onUpdatePanel: (panelId: string, updates: Partial<ComicPanel>) => void;
  onRegeneratePanel: (panel: ComicPanel) => void;
  onAddPanel: () => void;
  onDeletePanel: (panelId: string) => void;
  onDuplicatePanel: (panelId: string) => void;
  onMovePanel: (panelId: string, direction: 'up' | 'down') => void;
  onOpenCharacterModal: (character?: Character) => void;
}

export const PanelsWorkspace: React.FC<PanelsWorkspaceProps> = ({
  panels,
  allCharacters,
  onUpdatePanel,
  onRegeneratePanel,
  onAddPanel,
  onDeletePanel,
  onDuplicatePanel,
  onMovePanel,
  onOpenCharacterModal,
}) => {
  const [expandedPanelId, setExpandedPanelId] = useState<string>(
    panels[0]?.id || ''
  );
  const [activeMenuPanelId, setActiveMenuPanelId] = useState<string | null>(null);

  // Toggle active character in a panel
  const handleToggleCharacter = (panel: ComicPanel, characterId: string) => {
    const exists = panel.characterIds.includes(characterId);
    const updatedIds = exists
      ? panel.characterIds.filter((id) => id !== characterId)
      : [...panel.characterIds, characterId];
    onUpdatePanel(panel.id, { characterIds: updatedIds });
  };

  // Add new dialogue to panel
  const handleAddDialogue = (panel: ComicPanel) => {
    const firstChar = allCharacters.find((c) => panel.characterIds.includes(c.id)) || allCharacters[0];
    const newDialogue: Dialogue = {
      id: `diag-${Date.now()}`,
      speaker: firstChar ? firstChar.name : 'Narrator',
      text: 'New dialogue here...',
      type: 'speech',
      position: { x: 50, y: 15 },
    };
    onUpdatePanel(panel.id, {
      dialogues: [...panel.dialogues, newDialogue],
    });
  };

  // Update specific dialogue in panel
  const handleUpdateDialogue = (
    panel: ComicPanel,
    dialogueId: string,
    field: keyof Dialogue,
    value: any
  ) => {
    const updated = panel.dialogues.map((d) =>
      d.id === dialogueId ? { ...d, [field]: value } : d
    );
    onUpdatePanel(panel.id, { dialogues: updated });
  };

  // Delete dialogue from panel
  const handleDeleteDialogue = (panel: ComicPanel, dialogueId: string) => {
    const updated = panel.dialogues.filter((d) => d.id !== dialogueId);
    onUpdatePanel(panel.id, { dialogues: updated });
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-4">
      {panels.map((panel, index) => {
        const isExpanded = panel.id === expandedPanelId;
        const panelCharacters = allCharacters.filter((c) =>
          panel.characterIds.includes(c.id)
        );

        return (
          <div
            key={panel.id}
            className={`rounded-xl transition-all duration-200 ${
              isExpanded
                ? 'bg-[#100613]/90 border border-rose-600/90 shadow-[0_0_24px_rgba(225,29,72,0.18)]'
                : 'bg-[#110714]/60 border border-zinc-800/80 hover:border-zinc-700'
            }`}
          >
            {/* Panel Card Header */}
            <div className="flex items-center justify-between px-4 py-3 select-none">
              <button
                onClick={() =>
                  setExpandedPanelId(isExpanded ? '' : panel.id)
                }
                className="flex items-center gap-2 text-base font-bold text-white hover:text-rose-200 transition-colors"
              >
                <span>Panel {index + 1}</span>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-zinc-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-zinc-400" />
                )}
              </button>

              <div className="flex items-center gap-2 relative">
                {/* Regenerate Button matching screenshot */}
                {isExpanded && (
                  <button
                    onClick={() => onRegeneratePanel(panel)}
                    disabled={panel.isGenerating}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-semibold shadow-md shadow-rose-950/60 transition-all disabled:opacity-50"
                  >
                    {panel.isGenerating ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-rose-200" />
                    )}
                    <span>Regenerate</span>
                  </button>
                )}

                {/* Aspect / Layout icon */}
                <button
                  title="Panel Frame Format"
                  onClick={() => {
                    const ratios: Array<'3:4' | '1:1' | '16:9'> = ['3:4', '1:1', '16:9'];
                    const currentIdx = ratios.indexOf(panel.aspectRatio as any) || 0;
                    const next = ratios[(currentIdx + 1) % ratios.length];
                    onUpdatePanel(panel.id, { aspectRatio: next });
                  }}
                  className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-white/5 border border-zinc-800 transition-colors"
                >
                  <Maximize className="w-3.5 h-3.5" />
                </button>

                {/* Three dots menu */}
                <button
                  onClick={() =>
                    setActiveMenuPanelId(
                      activeMenuPanelId === panel.id ? null : panel.id
                    )
                  }
                  className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {/* Context Menu Dropdown */}
                {activeMenuPanelId === panel.id && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setActiveMenuPanelId(null)}
                    />
                    <div className="absolute right-0 top-8 w-44 rounded-lg bg-[#140617] border border-rose-900/60 shadow-xl py-1 z-40 text-xs">
                      <button
                        onClick={() => {
                          onDuplicatePanel(panel.id);
                          setActiveMenuPanelId(null);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-zinc-300 hover:text-white hover:bg-rose-950/40"
                      >
                        <Copy className="w-3.5 h-3.5 text-rose-400" />
                        <span>Duplicate Panel</span>
                      </button>

                      {index > 0 && (
                        <button
                          onClick={() => {
                            onMovePanel(panel.id, 'up');
                            setActiveMenuPanelId(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-zinc-300 hover:text-white hover:bg-rose-950/40"
                        >
                          <ArrowUp className="w-3.5 h-3.5 text-zinc-400" />
                          <span>Move Up</span>
                        </button>
                      )}

                      {index < panels.length - 1 && (
                        <button
                          onClick={() => {
                            onMovePanel(panel.id, 'down');
                            setActiveMenuPanelId(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-zinc-300 hover:text-white hover:bg-rose-950/40"
                        >
                          <ArrowDown className="w-3.5 h-3.5 text-zinc-400" />
                          <span>Move Down</span>
                        </button>
                      )}

                      <div className="h-[1px] bg-zinc-800 my-1" />

                      <button
                        onClick={() => {
                          onDeletePanel(panel.id);
                          setActiveMenuPanelId(null);
                        }}
                        disabled={panels.length <= 1}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/50 disabled:opacity-40"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Panel</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Expanded Body Content */}
            {isExpanded && (
              <div className="px-4 pb-5 pt-1 space-y-5 animate-in fade-in duration-200">
                {/* SCENE SECTION */}
                <div className="space-y-3">
                  <div className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase">
                    SCENE
                  </div>

                  {/* DESCRIPTION */}
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
                      DESCRIPTION
                    </div>
                    <textarea
                      rows={3}
                      value={panel.description}
                      onChange={(e) =>
                        onUpdatePanel(panel.id, {
                          description: e.target.value,
                        })
                      }
                      className="w-full bg-[#16081a]/80 border border-zinc-800 hover:border-zinc-700 focus:border-rose-600 rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-none transition-colors leading-relaxed"
                    />
                  </div>

                  {/* 4 Metadata Cards: LOCATION, TIME OF DAY, CAMERA ANGLE, CAMERA SHOT */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                    {/* SCENE LOCATION */}
                    <div className="bg-[#150718]/80 border border-zinc-800/80 rounded-lg p-2 space-y-1">
                      <div className="text-[9px] font-bold tracking-wider text-zinc-500 uppercase truncate">
                        SCENE LOCATION
                      </div>
                      <input
                        type="text"
                        value={panel.sceneLocation}
                        onChange={(e) =>
                          onUpdatePanel(panel.id, {
                            sceneLocation: e.target.value,
                          })
                        }
                        className="w-full bg-transparent text-xs font-semibold text-zinc-200 focus:outline-none truncate"
                        placeholder="e.g. Headquarters"
                      />
                    </div>

                    {/* TIME OF DAY */}
                    <div className="bg-[#150718]/80 border border-zinc-800/80 rounded-lg p-2 space-y-1">
                      <div className="text-[9px] font-bold tracking-wider text-zinc-500 uppercase">
                        TIME OF DAY
                      </div>
                      <select
                        value={panel.timeOfDay}
                        onChange={(e) =>
                          onUpdatePanel(panel.id, {
                            timeOfDay: e.target.value,
                          })
                        }
                        className="w-full bg-transparent text-xs font-semibold text-zinc-200 focus:outline-none cursor-pointer"
                      >
                        <option value="Morning" className="bg-[#16081a]">Morning</option>
                        <option value="Day" className="bg-[#16081a]">Day</option>
                        <option value="Sunset" className="bg-[#16081a]">Sunset</option>
                        <option value="Evening" className="bg-[#16081a]">Evening</option>
                        <option value="Night" className="bg-[#16081a]">Night</option>
                        <option value="Midnight" className="bg-[#16081a]">Midnight</option>
                        <option value="Dawn" className="bg-[#16081a]">Dawn</option>
                      </select>
                    </div>

                    {/* CAMERA ANGLE */}
                    <div className="bg-[#150718]/80 border border-zinc-800/80 rounded-lg p-2 space-y-1">
                      <div className="text-[9px] font-bold tracking-wider text-zinc-500 uppercase">
                        CAMERA ANGLE
                      </div>
                      <select
                        value={panel.cameraAngle}
                        onChange={(e) =>
                          onUpdatePanel(panel.id, {
                            cameraAngle: e.target.value,
                          })
                        }
                        className="w-full bg-transparent text-xs font-semibold text-zinc-200 focus:outline-none cursor-pointer"
                      >
                        <option value="Wide Angle" className="bg-[#16081a]">Wide Angle</option>
                        <option value="Eye Level" className="bg-[#16081a]">Eye Level</option>
                        <option value="Low Angle" className="bg-[#16081a]">Low Angle</option>
                        <option value="High Angle" className="bg-[#16081a]">High Angle</option>
                        <option value="Dutch Tilt" className="bg-[#16081a]">Dutch Tilt</option>
                        <option value="Bird's Eye" className="bg-[#16081a]">Bird's Eye</option>
                      </select>
                    </div>

                    {/* CAMERA SHOT */}
                    <div className="bg-[#150718]/80 border border-zinc-800/80 rounded-lg p-2 space-y-1">
                      <div className="text-[9px] font-bold tracking-wider text-zinc-500 uppercase">
                        CAMERA SHOT
                      </div>
                      <select
                        value={panel.cameraShot}
                        onChange={(e) =>
                          onUpdatePanel(panel.id, {
                            cameraShot: e.target.value,
                          })
                        }
                        className="w-full bg-transparent text-xs font-semibold text-zinc-200 focus:outline-none cursor-pointer"
                      >
                        <option value="Long shot" className="bg-[#16081a]">Long shot</option>
                        <option value="Medium shot" className="bg-[#16081a]">Medium shot</option>
                        <option value="Close-up" className="bg-[#16081a]">Close-up</option>
                        <option value="Extreme Close-up" className="bg-[#16081a]">Extreme Close-up</option>
                        <option value="Establishing Shot" className="bg-[#16081a]">Establishing Shot</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* CHARACTERS SECTION */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase">
                      CHARACTERS
                    </span>
                    <button
                      onClick={() => onOpenCharacterModal()}
                      className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1"
                    >
                      <span>+ Add Character</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {panelCharacters.map((char, charIdx) => (
                      <div
                        key={char.id}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-[#16081a]/90 border border-zinc-800 hover:border-zinc-700 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={char.avatar}
                            alt={char.name}
                            className="w-9 h-9 rounded-md border border-rose-900/60 object-cover shrink-0 bg-zinc-900"
                          />
                          <div className="min-w-0">
                            <div className="text-[10px] font-semibold text-zinc-500 uppercase">
                              Character {charIdx + 1}
                            </div>
                            <div className="text-xs font-bold text-zinc-100 truncate">
                              {char.name}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => onOpenCharacterModal(char)}
                          className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-white/5 rounded transition-colors"
                          title="Edit Character"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    {/* Quick Character selector if characters exist in project but not in this panel */}
                    {allCharacters
                      .filter((c) => !panel.characterIds.includes(c.id))
                      .map((char) => (
                        <button
                          key={char.id}
                          onClick={() => handleToggleCharacter(panel, char.id)}
                          className="flex items-center gap-2 p-2 rounded-lg border border-dashed border-zinc-800 hover:border-rose-700 text-zinc-400 hover:text-zinc-200 text-xs transition-colors"
                        >
                          <img
                            src={char.avatar}
                            alt={char.name}
                            className="w-6 h-6 rounded-full opacity-60"
                          />
                          <span>+ Include {char.name}</span>
                        </button>
                      ))}
                  </div>
                </div>

                {/* DIALOGUES SECTION */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase">
                      DIALOGUES
                    </span>
                    <button
                      onClick={() => handleAddDialogue(panel)}
                      className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1"
                    >
                      <span>+ Add Dialogue</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {panel.dialogues.map((diag) => (
                      <div
                        key={diag.id}
                        className="p-3 rounded-lg bg-[#16081a]/90 border border-zinc-800 space-y-2"
                      >
                        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase">
                              Dialogue
                            </span>
                            <span className="text-zinc-600">•</span>
                            <select
                              value={diag.speaker}
                              onChange={(e) =>
                                handleUpdateDialogue(
                                  panel,
                                  diag.id,
                                  'speaker',
                                  e.target.value
                                )
                              }
                              className="bg-transparent text-xs font-bold text-rose-300 focus:outline-none cursor-pointer"
                            >
                              {allCharacters.map((c) => (
                                <option
                                  key={c.id}
                                  value={c.name}
                                  className="bg-[#16081a] text-white"
                                >
                                  {c.name}
                                </option>
                              ))}
                              <option
                                value="Narration"
                                className="bg-[#16081a] text-amber-300"
                              >
                                Narration
                              </option>
                            </select>
                          </div>

                          <button
                            onClick={() =>
                              handleDeleteDialogue(panel, diag.id)
                            }
                            title="Remove Dialogue"
                            className="text-zinc-500 hover:text-rose-400 p-1"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                        <textarea
                          rows={2}
                          value={diag.text}
                          onChange={(e) =>
                            handleUpdateDialogue(
                              panel,
                              diag.id,
                              'text',
                              e.target.value
                            )
                          }
                          className="w-full bg-transparent text-xs text-zinc-200 focus:outline-none resize-none leading-relaxed"
                          placeholder="Character speech or narration..."
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* + Add Panel Button at bottom of panels list */}
      <button
        onClick={onAddPanel}
        className="w-full py-2.5 px-4 rounded-xl border border-dashed border-rose-900/60 hover:border-rose-600 bg-rose-950/15 hover:bg-rose-900/25 text-rose-300 hover:text-white font-semibold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        <span>+ Add Panel</span>
      </button>
    </div>
  );
};
