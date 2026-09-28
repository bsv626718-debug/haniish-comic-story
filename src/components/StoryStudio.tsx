import React, { useState } from 'react';
import { Sparkles, BookOpen, Wand2, Loader2, ArrowRight, CheckCircle2, RefreshCw, Palette } from 'lucide-react';
import { requestComicStoryGeneration, GeneratedStoryResult } from '../lib/gemini';
import { Character, ComicPanel, ComicProject, StoryChapter } from '../types/comic';
import { generateComicSceneSVG } from '../lib/comicArtGenerator';

interface StoryStudioProps {
  project: ComicProject;
  onApplyStory: (story: StoryChapter, newCharacters: Character[]) => void;
  onSwitchToPanels: () => void;
}

export const StoryStudio: React.FC<StoryStudioProps> = ({
  project,
  onApplyStory,
  onSwitchToPanels,
}) => {
  const [prompt, setPrompt] = useState(
    'An alien armada silently enters orbit above Metropolis. Vigilante hero Doga and his mentor Adrak Chacha discover the impending invasion via the classified Abyss Protocol.'
  );
  const [genre, setGenre] = useState('Superhero / Sci-Fi');
  const [artStyle, setArtStyle] = useState('Retro 90s Graphic Novel');
  const [numPanels, setNumPanels] = useState(4);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [generatedResult, setGeneratedResult] = useState<GeneratedStoryResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const presets = [
    {
      title: 'The Attack of the ETs',
      genre: 'Superhero / Sci-Fi',
      artStyle: 'Retro 90s Graphic Novel',
      prompt: 'An alien armada silently enters orbit above Metropolis. Vigilante hero Doga and his mentor Adrak Chacha discover the impending invasion via the classified Abyss Protocol.',
    },
    {
      title: 'Cyberpunk Syndicate Heist',
      genre: 'Cyberpunk 2099',
      artStyle: 'Dark Noir Halftone',
      prompt: 'A cyber-enhanced rogue infiltrates the neon tower of OmniCorp to retrieve an AI memory core before the enforcers breach the server room.',
    },
    {
      title: 'Tokyo Phantom Duel',
      genre: 'Japanese Shonen Manga',
      artStyle: 'Japanese Manga / Inked',
      prompt: 'High school exorcist Kenji unseals a legendary cursed blade during a thunderstorm to defend the sacred shrine from a shadow demon.',
    },
    {
      title: 'Gotham Midnight Detective',
      genre: 'Dark Detective Noir',
      artStyle: 'Modern Cinematic Comic',
      prompt: 'A rain-soaked detective discovers a strange glowing alien cipher painted at the crime scene in an abandoned subway station.',
    },
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMsg(null);
    setGenerationStep('Analyzing narrative arc with Gemini...');

    try {
      setTimeout(() => setGenerationStep('Developing characters & visual cues...'), 1200);
      setTimeout(() => setGenerationStep('Composing panel camera angles & scene lighting...'), 2400);
      setTimeout(() => setGenerationStep('Writing punchy dialogue & speech bubbles...'), 3600);

      const result = await requestComicStoryGeneration({
        prompt,
        genre,
        artStyle,
        characters: project.characters.map((c) => ({
          name: c.name,
          role: c.role,
          appearance: c.appearance,
        })),
        numPanels,
      });

      setGeneratedResult(result);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to generate story script.');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const handleApplyScript = () => {
    if (!generatedResult) return;

    // Build new characters
    const newCharacters: Character[] = (generatedResult.characters || []).map(
      (c, idx) => {
        // check if character with same name already exists
        const existing = project.characters.find(
          (ex) => ex.name.toLowerCase() === c.name.toLowerCase()
        );
        if (existing) return existing;

        return {
          id: `char-gen-${Date.now()}-${idx}`,
          name: c.name,
          role: c.role || 'Character',
          avatar: `data:image/svg+xml;utf8,${encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
              <rect width="100" height="100" fill="#1e1026"/>
              <circle cx="50" cy="45" r="30" fill="#f43f5e"/>
              <text x="50" y="55" font-family="sans-serif" font-size="28" font-weight="bold" fill="#ffffff" text-anchor="middle">${c.name.charAt(0)}</text>
            </svg>
          `)}`,
          appearance: c.appearance || '',
          clothing: c.clothing || '',
          personality: c.personality || '',
          powers: c.powers || '',
        };
      }
    );

    // Build comic panels
    const panels: ComicPanel[] = (generatedResult.panels || []).map(
      (p, pIdx) => {
        const charIds = newCharacters
          .filter((c) =>
            (p.characterNames || []).some(
              (name) => name.toLowerCase() === c.name.toLowerCase()
            )
          )
          .map((c) => c.id);

        return {
          id: `panel-${Date.now()}-${pIdx}`,
          panelNumber: p.panelNumber || pIdx + 1,
          description: p.description || '',
          sceneLocation: p.sceneLocation || 'Metropolis',
          timeOfDay: p.timeOfDay || 'Evening',
          cameraAngle: p.cameraAngle || 'Wide Angle',
          cameraShot: p.cameraShot || 'Medium shot',
          characterIds: charIds.length > 0 ? charIds : [newCharacters[0]?.id].filter(Boolean),
          dialogues: (p.dialogues || []).map((d, dIdx) => ({
            id: `diag-${Date.now()}-${dIdx}`,
            speaker: d.speaker || 'Narrator',
            text: d.text || '',
            type: d.type || 'speech',
            position: { x: dIdx % 2 === 0 ? 35 : 75, y: 8 + dIdx * 9 },
          })),
          imageUrl: generateComicSceneSVG({
            panelNumber: p.panelNumber || pIdx + 1,
            sceneDescription: p.description,
            location: p.sceneLocation,
            timeOfDay: p.timeOfDay,
            cameraShot: p.cameraShot,
            artStyle,
          }),
          aspectRatio: '3:4',
        };
      }
    );

    const newStoryChapter: StoryChapter = {
      id: `story-${Date.now()}`,
      title: generatedResult.title || 'Untitled Chapter',
      synopsis: generatedResult.synopsis || '',
      panels,
    };

    onApplyStory(newStoryChapter, newCharacters);
    onSwitchToPanels();
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 max-w-5xl mx-auto space-y-6">
      {/* Studio Banner */}
      <div className="flex items-start justify-between border-b border-rose-950/40 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-rose-950/60 border border-rose-800 text-rose-300">
              Gemini Story Engine
            </span>
            <span className="text-zinc-500 text-xs">gemini-3.8-flash</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1.5 tracking-tight">
            AI Story & Script Generator
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Describe your comic premise or scenario. Google Gemini will create the full narrative arc, character profiles, camera staging, panel breakdowns, and authentic comic dialogue.
          </p>
        </div>

        <button
          onClick={onSwitchToPanels}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white text-xs font-semibold transition-colors"
        >
          <span>Go to Panels Workspace</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Preset Inspiration Pills */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
          Quick Story Inspiration
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {presets.map((preset) => (
            <button
              key={preset.title}
              onClick={() => {
                setPrompt(preset.prompt);
                setGenre(preset.genre);
                setArtStyle(preset.artStyle);
              }}
              className="p-2.5 rounded-lg bg-[#140818]/60 border border-zinc-800/80 hover:border-rose-800/60 text-left transition-all group"
            >
              <div className="text-xs font-bold text-zinc-200 group-hover:text-rose-300 truncate">
                {preset.title}
              </div>
              <div className="text-[10px] text-zinc-500 truncate mt-0.5">
                {preset.genre}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Prompt Form */}
      <div className="rounded-xl bg-[#120716]/80 border border-rose-950/60 p-5 space-y-4">
        <div>
          <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
            Story Concept & Plot Prompt
          </label>
          <textarea
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your characters, conflict, setting, and comic twists..."
            className="w-full bg-[#18091d] border border-zinc-800 focus:border-rose-600 rounded-lg p-3 text-sm text-zinc-100 focus:outline-none leading-relaxed transition-colors"
          />
        </div>

        {/* Configuration Row: Genre, Art Style, Number of Panels */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          {/* Genre */}
          <div>
            <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
              Genre
            </label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full bg-[#18091d] border border-zinc-800 rounded-lg p-2.5 text-xs font-semibold text-zinc-200 focus:outline-none cursor-pointer"
            >
              <option value="Superhero / Sci-Fi">Superhero / Sci-Fi</option>
              <option value="Cyberpunk 2099">Cyberpunk 2099</option>
              <option value="Dark Detective Noir">Dark Detective Noir</option>
              <option value="Japanese Shonen Manga">Japanese Shonen Manga</option>
              <option value="Space Opera / Cosmic">Space Opera / Cosmic</option>
              <option value="Dark Fantasy & Magic">Dark Fantasy & Magic</option>
              <option value="Post-Apocalyptic Survival">Post-Apocalyptic</option>
            </select>
          </div>

          {/* Art Style */}
          <div>
            <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
              Comic Art Style
            </label>
            <select
              value={artStyle}
              onChange={(e) => setArtStyle(e.target.value)}
              className="w-full bg-[#18091d] border border-zinc-800 rounded-lg p-2.5 text-xs font-semibold text-zinc-200 focus:outline-none cursor-pointer"
            >
              <option value="Retro 90s Graphic Novel">Retro 90s Graphic Novel</option>
              <option value="Modern Cinematic Comic">Modern Cinematic Comic</option>
              <option value="Japanese Manga / Inked">Japanese Manga / Inked</option>
              <option value="Dark Noir Halftone">Dark Noir Halftone</option>
              <option value="Vintage Pulp 50s">Vintage Pulp 50s</option>
              <option value="Anime Cell-Shaded">Anime Cell-Shaded</option>
            </select>
          </div>

          {/* Number of Panels */}
          <div>
            <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
              Number of Panels
            </label>
            <select
              value={numPanels}
              onChange={(e) => setNumPanels(parseInt(e.target.value, 10))}
              className="w-full bg-[#18091d] border border-zinc-800 rounded-lg p-2.5 text-xs font-semibold text-zinc-200 focus:outline-none cursor-pointer"
            >
              <option value={2}>2 Panels (Short Strip)</option>
              <option value={4}>4 Panels (Classic Page - Recommended)</option>
              <option value={6}>6 Panels (Full Action Sequence)</option>
              <option value={8}>8 Panels (Extended Double Page)</option>
            </select>
          </div>
        </div>

        {/* Generate Action Button */}
        <div className="pt-2 flex items-center justify-between">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-rose-600 via-rose-700 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-rose-950/60 transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating Script...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-rose-200" />
                <span>Generate Comic Script with Gemini</span>
              </>
            )}
          </button>

          {isGenerating && (
            <div className="text-xs text-rose-300 font-mono animate-pulse">
              {generationStep}
            </div>
          )}
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-800 text-xs text-rose-200">
            {errorMsg}
          </div>
        )}
      </div>

      {/* Generated Result Preview */}
      {generatedResult && (
        <div className="rounded-xl bg-[#120716]/90 border border-rose-700/80 p-5 space-y-5 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                Generated Comic Script
              </div>
              <h2 className="text-xl font-black text-white mt-0.5">
                {generatedResult.title}
              </h2>
              <p className="text-xs text-zinc-400 mt-1 max-w-xl">
                {generatedResult.synopsis}
              </p>
            </div>

            <button
              onClick={handleApplyScript}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wide shadow-md transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Apply Script to Comic & Create Panels</span>
            </button>
          </div>

          {/* Character Cast preview */}
          {generatedResult.characters?.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                Character Cast
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {generatedResult.characters.map((c, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-[#18091d] border border-zinc-800"
                  >
                    <div className="text-xs font-bold text-white">{c.name}</div>
                    <div className="text-[10px] text-rose-400 font-semibold">{c.role}</div>
                    <div className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                      {c.appearance}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Panels Breakdown */}
          <div className="space-y-3">
            <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              Panel Breakdown ({generatedResult.panels?.length} Panels)
            </div>
            <div className="space-y-3">
              {generatedResult.panels?.map((panel, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg bg-[#18091d] border border-zinc-800/80 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
                    <span className="text-rose-400">Panel {panel.panelNumber || idx + 1}</span>
                    <span className="text-[10px] text-zinc-500 font-normal">
                      {panel.sceneLocation} · {panel.timeOfDay} · {panel.cameraShot}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-200 leading-relaxed">
                    {panel.description}
                  </div>
                  {panel.dialogues?.length > 0 && (
                    <div className="space-y-1 pt-1 border-t border-zinc-800/60">
                      {panel.dialogues.map((d, dIdx) => (
                        <div key={dIdx} className="text-xs flex gap-2">
                          <span className="font-bold text-rose-300">{d.speaker}:</span>
                          <span className="text-zinc-300 italic font-comic uppercase">"{d.text}"</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
