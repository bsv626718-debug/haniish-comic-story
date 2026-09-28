import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { PanelsWorkspace } from './components/PanelsWorkspace';
import { ComicPreview } from './components/ComicPreview';
import { StoryStudio } from './components/StoryStudio';
import { CharacterModal } from './components/CharacterModal';
import { ExportModal } from './components/ExportModal';
import { ShareModal } from './components/ShareModal';
import { ReaderModal } from './components/ReaderModal';
import { ComicProject, ComicPanel, Character, StoryChapter } from './types/comic';
import { initialProject } from './lib/sampleData';
import { requestPanelImageGeneration } from './lib/gemini';
import { generateComicSceneSVG } from './lib/comicArtGenerator';

export default function App() {
  const [project, setProject] = useState<ComicProject>(() => {
    try {
      const saved = localStorage.getItem('comiccraft_project');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('LocalStorage load notice:', e);
    }
    return initialProject;
  });

  const [activeTab, setActiveTab] = useState<'story' | 'panels'>('panels');
  const [isSaving, setIsSaving] = useState(false);

  // Modals state
  const [isCharacterModalOpen, setIsCharacterModalOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isReaderModalOpen, setIsReaderModalOpen] = useState(false);

  // Autosave to localStorage
  useEffect(() => {
    setIsSaving(true);
    const timer = setTimeout(() => {
      try {
        localStorage.setItem('comiccraft_project', JSON.stringify(project));
      } catch (e) {
        console.warn('LocalStorage save error:', e);
      }
      setIsSaving(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [project]);

  // Current active story
  const activeStory =
    project.stories.find((s) => s.id === project.activeStoryId) ||
    project.stories[0];

  // Helper to update active story panels
  const updateActiveStoryPanels = (
    updateFn: (currentPanels: ComicPanel[]) => ComicPanel[]
  ) => {
    setProject((prev) => {
      const updatedStories = prev.stories.map((story) => {
        if (story.id === prev.activeStoryId) {
          const updatedPanels = updateFn(story.panels);
          return { ...story, panels: updatedPanels };
        }
        return story;
      });
      return { ...prev, stories: updatedStories, updatedAt: new Date().toISOString() };
    });
  };

  // Update specific panel fields
  const handleUpdatePanel = (panelId: string, updates: Partial<ComicPanel>) => {
    updateActiveStoryPanels((panels) =>
      panels.map((p) => (p.id === panelId ? { ...p, ...updates } : p))
    );
  };

  // Regenerate panel illustration with AI
  const handleRegeneratePanel = async (panel: ComicPanel) => {
    handleUpdatePanel(panel.id, { isGenerating: true });
    try {
      const charNames = project.characters
        .filter((c) => panel.characterIds.includes(c.id))
        .map((c) => c.name);

      const newImageUrl = await requestPanelImageGeneration({
        panelNumber: panel.panelNumber,
        prompt: panel.description,
        artStyle: project.artStyle,
        characters: charNames,
        sceneLocation: panel.sceneLocation,
        timeOfDay: panel.timeOfDay,
        cameraShot: panel.cameraShot,
      });

      handleUpdatePanel(panel.id, {
        imageUrl: newImageUrl,
        isGenerating: false,
      });
    } catch (err) {
      console.error('Failed to regenerate panel:', err);
      // fallback
      const fallbackUrl = generateComicSceneSVG({
        panelNumber: panel.panelNumber,
        sceneDescription: panel.description,
        location: panel.sceneLocation,
        timeOfDay: panel.timeOfDay,
        cameraShot: panel.cameraShot,
        artStyle: project.artStyle,
      });
      handleUpdatePanel(panel.id, {
        imageUrl: fallbackUrl,
        isGenerating: false,
      });
    }
  };

  // Add new panel to active story
  const handleAddPanel = () => {
    const currentPanels = activeStory.panels;
    const nextNumber = currentPanels.length + 1;
    const defaultChar = project.characters[0];

    const newPanel: ComicPanel = {
      id: `panel-${Date.now()}`,
      panelNumber: nextNumber,
      description: `Panel ${nextNumber}: The dramatic confrontation continues as the heroes advance.`,
      sceneLocation: 'Doga Headquarters',
      timeOfDay: 'Night',
      cameraAngle: 'Eye Level',
      cameraShot: 'Medium shot',
      characterIds: defaultChar ? [defaultChar.id] : [],
      dialogues: [
        {
          id: `diag-${Date.now()}`,
          speaker: defaultChar ? defaultChar.name : 'Doga',
          text: 'Hold your positions!',
          type: 'speech',
          position: { x: 50, y: 12 },
        },
      ],
      imageUrl: generateComicSceneSVG({
        panelNumber: nextNumber,
        sceneDescription: 'The confrontation intensifies',
        location: 'Doga Headquarters',
        timeOfDay: 'Night',
        cameraShot: 'Medium shot',
      }),
      aspectRatio: '3:4',
    };

    updateActiveStoryPanels((panels) => [...panels, newPanel]);
  };

  // Delete panel
  const handleDeletePanel = (panelId: string) => {
    updateActiveStoryPanels((panels) => {
      const filtered = panels.filter((p) => p.id !== panelId);
      // re-number panels
      return filtered.map((p, idx) => ({ ...p, panelNumber: idx + 1 }));
    });
  };

  // Duplicate panel
  const handleDuplicatePanel = (panelId: string) => {
    updateActiveStoryPanels((panels) => {
      const idx = panels.findIndex((p) => p.id === panelId);
      if (idx === -1) return panels;
      const target = panels[idx];
      const duplicated: ComicPanel = {
        ...target,
        id: `panel-dup-${Date.now()}`,
        panelNumber: idx + 2,
        dialogues: target.dialogues.map((d) => ({
          ...d,
          id: `diag-dup-${Date.now()}-${Math.random()}`,
        })),
      };
      const copy = [...panels];
      copy.splice(idx + 1, 0, duplicated);
      return copy.map((p, i) => ({ ...p, panelNumber: i + 1 }));
    });
  };

  // Move panel up / down
  const handleMovePanel = (panelId: string, direction: 'up' | 'down') => {
    updateActiveStoryPanels((panels) => {
      const idx = panels.findIndex((p) => p.id === panelId);
      if (idx === -1) return panels;
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= panels.length) return panels;

      const copy = [...panels];
      const [moved] = copy.splice(idx, 1);
      copy.splice(targetIdx, 0, moved);
      return copy.map((p, i) => ({ ...p, panelNumber: i + 1 }));
    });
  };

  // Add new story chapter
  const handleAddStory = () => {
    const nextIndex = project.stories.length + 1;
    const newStory: StoryChapter = {
      id: `story-${Date.now()}`,
      title: `Untitled Story ${nextIndex}`,
      synopsis: 'A new chapter unfolds.',
      panels: [
        {
          id: `panel-${Date.now()}-1`,
          panelNumber: 1,
          description: 'The story commences under an ominous sky.',
          sceneLocation: 'City Outskirts',
          timeOfDay: 'Evening',
          cameraAngle: 'Wide Angle',
          cameraShot: 'Establishing Shot',
          characterIds: project.characters[0] ? [project.characters[0].id] : [],
          dialogues: [
            {
              id: `diag-${Date.now()}`,
              speaker: project.characters[0] ? project.characters[0].name : 'Narrator',
              text: 'Here it begins.',
              type: 'speech',
              position: { x: 50, y: 12 },
            },
          ],
          imageUrl: generateComicSceneSVG({
            panelNumber: 1,
            sceneDescription: 'The story commences under an ominous sky',
            location: 'City Outskirts',
            timeOfDay: 'Evening',
            cameraShot: 'Establishing Shot',
          }),
          aspectRatio: '3:4',
        },
      ],
    };

    setProject((prev) => ({
      ...prev,
      stories: [...prev.stories, newStory],
      activeStoryId: newStory.id,
    }));
  };

  // Save character
  const handleSaveCharacter = (char: Character) => {
    setProject((prev) => {
      const exists = prev.characters.some((c) => c.id === char.id);
      const updatedChars = exists
        ? prev.characters.map((c) => (c.id === char.id ? char : c))
        : [...prev.characters, char];
      return { ...prev, characters: updatedChars };
    });
  };

  // Delete character
  const handleDeleteCharacter = (charId: string) => {
    setProject((prev) => ({
      ...prev,
      characters: prev.characters.filter((c) => c.id !== charId),
    }));
  };

  // Apply new AI story
  const handleApplyStory = (
    newStory: StoryChapter,
    newCharacters: Character[]
  ) => {
    setProject((prev) => {
      // merge characters without duplicates
      const mergedChars = [...prev.characters];
      for (const nc of newCharacters) {
        if (!mergedChars.some((c) => c.id === nc.id || c.name.toLowerCase() === nc.name.toLowerCase())) {
          mergedChars.push(nc);
        }
      }

      return {
        ...prev,
        characters: mergedChars,
        stories: [...prev.stories, newStory],
        activeStoryId: newStory.id,
      };
    });
  };

  // Reset to initial sample comic
  const handleResetToSample = () => {
    if (window.confirm('Reset comic studio to default "The Attack of the ETs" sample project?')) {
      setProject(initialProject);
    }
  };

  // Create new blank comic
  const handleNewProject = () => {
    const title = window.prompt('Enter new comic project title:', 'My New Comic');
    if (!title) return;

    const newProject: ComicProject = {
      id: `comic-${Date.now()}`,
      title,
      description: 'An original comic created with ComicCraft.',
      genre: 'Superhero / Sci-Fi',
      artStyle: 'Retro 90s Graphic Novel',
      characters: [
        {
          id: `char-${Date.now()}`,
          name: 'Hero',
          role: 'Protagonist',
          avatar: `data:image/svg+xml;utf8,${encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
              <rect width="100" height="100" fill="#1e1b4b"/>
              <circle cx="50" cy="45" r="30" fill="#f43f5e"/>
              <text x="50" y="55" font-family="sans-serif" font-size="28" font-weight="bold" fill="#ffffff" text-anchor="middle">H</text>
            </svg>
          `)}`,
          appearance: 'Brave superhero in armor',
          clothing: 'Reinforced tactical gear',
          personality: 'Valiant and determined',
        },
      ],
      stories: [
        {
          id: `story-${Date.now()}`,
          title: 'Chapter 1: The Beginning',
          panels: [
            {
              id: `panel-${Date.now()}-1`,
              panelNumber: 1,
              description: 'Establishing shot of the city as shadows lengthen.',
              sceneLocation: 'City Center',
              timeOfDay: 'Sunset',
              cameraAngle: 'Wide Angle',
              cameraShot: 'Establishing Shot',
              characterIds: [],
              dialogues: [
                {
                  id: `diag-${Date.now()}`,
                  speaker: 'Narrator',
                  text: 'It started on an ordinary afternoon...',
                  type: 'narration',
                  position: { x: 50, y: 10 },
                },
              ],
              imageUrl: generateComicSceneSVG({
                panelNumber: 1,
                sceneDescription: 'Establishing shot of city at sunset',
                location: 'City Center',
                timeOfDay: 'Sunset',
                cameraShot: 'Establishing Shot',
              }),
              aspectRatio: '3:4',
            },
          ],
        },
      ],
      activeStoryId: `story-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProject(newProject);
  };

  return (
    <div className="flex flex-col h-screen w-screen cosmic-bg text-zinc-100 overflow-hidden font-sans">
      {/* Top Header */}
      <Header
        project={project}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onShare={() => setIsShareModalOpen(true)}
        onExport={() => setIsExportModalOpen(true)}
        onNewProject={handleNewProject}
        onOpenProjectList={handleResetToSample}
        isSaving={isSaving}
      />

      {/* Main 3-Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Navigation Sidebar */}
        <Sidebar
          project={project}
          activeStoryId={project.activeStoryId}
          onSelectStory={(storyId) => {
            setProject((prev) => ({ ...prev, activeStoryId: storyId }));
            setActiveTab('panels');
          }}
          onAddStory={handleAddStory}
          onUpdateTitle={(newTitle) =>
            setProject((prev) => ({ ...prev, title: newTitle }))
          }
          onOpenCharacterModal={(char) => {
            setEditingCharacter(char || null);
            setIsCharacterModalOpen(true);
          }}
        />

        {/* Center: Central Editor Workspace */}
        {activeTab === 'panels' ? (
          <PanelsWorkspace
            panels={activeStory.panels}
            allCharacters={project.characters}
            onUpdatePanel={handleUpdatePanel}
            onRegeneratePanel={handleRegeneratePanel}
            onAddPanel={handleAddPanel}
            onDeletePanel={handleDeletePanel}
            onDuplicatePanel={handleDuplicatePanel}
            onMovePanel={handleMovePanel}
            onOpenCharacterModal={(char) => {
              setEditingCharacter(char || null);
              setIsCharacterModalOpen(true);
            }}
          />
        ) : (
          <StoryStudio
            project={project}
            onApplyStory={handleApplyStory}
            onSwitchToPanels={() => setActiveTab('panels')}
          />
        )}

        {/* Right: Comic Preview Stack */}
        <ComicPreview
          panels={activeStory.panels}
          allCharacters={project.characters}
          onAddPanel={handleAddPanel}
          onExportPDF={() => setIsExportModalOpen(true)}
          onUpdateDialogueText={(panelId, dialogueId, newText) => {
            handleUpdatePanel(panelId, {
              dialogues: activeStory.panels
                .find((p) => p.id === panelId)
                ?.dialogues.map((d) =>
                  d.id === dialogueId ? { ...d, text: newText } : d
                ) || [],
            });
          }}
        />
      </div>

      {/* Modals */}
      <CharacterModal
        character={editingCharacter}
        isOpen={isCharacterModalOpen}
        onClose={() => {
          setIsCharacterModalOpen(false);
          setEditingCharacter(null);
        }}
        onSave={handleSaveCharacter}
        onDelete={handleDeleteCharacter}
      />

      <ExportModal
        project={project}
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

      <ShareModal
        project={project}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onOpenReader={() => setIsReaderModalOpen(true)}
      />

      <ReaderModal
        project={project}
        isOpen={isReaderModalOpen}
        onClose={() => setIsReaderModalOpen(false)}
      />
    </div>
  );
}
