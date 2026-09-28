export interface Character {
  id: string;
  name: string;
  role: string;
  avatar: string;
  appearance: string;
  clothing?: string;
  personality?: string;
  powers?: string;
}

export interface Dialogue {
  id: string;
  speaker: string;
  text: string;
  type?: 'speech' | 'thought' | 'shout' | 'whisper' | 'narration';
  position?: { x: number; y: number }; // percentage 0-100
}

export interface ComicPanel {
  id: string;
  panelNumber: number;
  description: string;
  sceneLocation: string;
  timeOfDay: string;
  cameraAngle: string;
  cameraShot: string;
  characterIds: string[];
  dialogues: Dialogue[];
  imageUrl?: string;
  isGenerating?: boolean;
  aspectRatio?: '1:1' | '16:9' | '3:4' | '4:3';
  soundEffect?: string;
}

export interface StoryChapter {
  id: string;
  title: string;
  synopsis?: string;
  panels: ComicPanel[];
}

export interface ComicProject {
  id: string;
  title: string;
  description?: string;
  genre: string;
  artStyle: string;
  stories: StoryChapter[];
  activeStoryId: string;
  characters: Character[];
  createdAt: string;
  updatedAt: string;
}
