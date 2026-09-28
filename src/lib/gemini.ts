import { generateComicSceneSVG } from './comicArtGenerator';

export interface GenerateStoryParams {
  prompt: string;
  genre?: string;
  artStyle?: string;
  characters?: Array<{ name: string; role?: string; appearance?: string }>;
  numPanels?: number;
}

export interface GeneratedStoryResult {
  title: string;
  synopsis: string;
  characters: Array<{
    name: string;
    role: string;
    appearance: string;
    clothing: string;
    personality: string;
    powers?: string;
  }>;
  panels: Array<{
    panelNumber: number;
    description: string;
    sceneLocation: string;
    timeOfDay: string;
    cameraAngle: string;
    cameraShot: string;
    characterNames: string[];
    dialogues: Array<{
      speaker: string;
      text: string;
      type?: 'speech' | 'thought' | 'shout' | 'whisper' | 'narration';
    }>;
  }>;
}

export async function requestComicStoryGeneration(
  params: GenerateStoryParams
): Promise<GeneratedStoryResult> {
  try {
    const res = await fetch('/api/ai/story', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.story) {
        return data.story;
      }
    }
  } catch (netErr) {
    console.warn('Network or API issue, falling back to local comic generator:', netErr);
  }

  // Graceful client fallback in case of temporary 503 model demand spikes
  const p = params.prompt || 'An unexpected cosmic anomaly threatens the city';
  const heroName = params.characters?.[0]?.name || 'Doga';
  const allyName = params.characters?.[1]?.name || 'Adrak Chacha';

  return {
    title: p.toLowerCase().includes('alien') ? 'The Attack of the ETs' : `${heroName}: Operation Dark Horizon`,
    synopsis: `An urgent crisis threatens the city as ${heroName} and ${allyName} decipher mysterious signals.`,
    characters: [
      {
        name: heroName,
        role: 'Vigilante Hero & Protector',
        appearance: 'Muscular hero in blue tactical bodysuit with canine cowl and crossed ammo bandoliers',
        clothing: 'Blue tactical suit, red combat boots, utility belt',
        personality: 'Fearless, determined, vigilant',
        powers: 'Tactical combat master, peak physical condition',
      },
      {
        name: allyName,
        role: 'Strategic Mentor & Advisor',
        appearance: 'Elderly tactician with bald head, gray mustache, carrying tactical datapad',
        clothing: 'Olive tactical robe / kurta',
        personality: 'Wise, cautious, strategic mastermind',
        powers: 'Data encryption, strategic radar analysis',
      },
    ],
    panels: [
      {
        panelNumber: 1,
        description: `${heroName} is looking worried and thinking about the future of his city. ${allyName} is sneaking on him from a far corner of his office.`,
        sceneLocation: `${heroName} Headquarters`,
        timeOfDay: 'Evening',
        cameraAngle: 'Wide Angle',
        cameraShot: 'Long shot',
        characterNames: [heroName, allyName],
        dialogues: [
          {
            speaker: heroName,
            text: "The reports...they can't be true, chacha!",
            type: 'speech' as const,
          },
          {
            speaker: allyName,
            text: 'They are, "Abyss protocol" could consume the city...possibly the world!',
            type: 'speech' as const,
          },
        ],
      },
      {
        panelNumber: 2,
        description: `Rear view of ${heroName} standing before the high observation window gazing over the metropolis at night. ${allyName} stands beside him reviewing threat signatures.`,
        sceneLocation: 'Observation Bay',
        timeOfDay: 'Night',
        cameraAngle: 'Eye Level',
        cameraShot: 'Medium shot',
        characterNames: [heroName, allyName],
        dialogues: [
          {
            speaker: heroName,
            text: "If they step one foot into this city, they'll learn we fight back.",
            type: 'speech' as const,
          },
          {
            speaker: allyName,
            text: 'Careful son, their mothership outclasses our defenses ten to one.',
            type: 'speech' as const,
          },
        ],
      },
      {
        panelNumber: 3,
        description: `Close-up of tactical console strobing crimson as alien dreadnought signatures pierce the cloud layer.`,
        sceneLocation: 'Tactical Radar Core',
        timeOfDay: 'Night',
        cameraAngle: 'Low Angle',
        cameraShot: 'Close-up',
        characterNames: [heroName],
        dialogues: [
          {
            speaker: heroName,
            text: 'Sound the general alarm. Lockdown Sector 7 now!',
            type: 'shout' as const,
          },
        ],
      },
      {
        panelNumber: 4,
        description: `Exterior of the metropolis skyline shrouded in dark violet storm clouds as the alien shadows eclipse the skyline.`,
        sceneLocation: 'City Skyline',
        timeOfDay: 'Midnight',
        cameraAngle: 'Dutch Tilt',
        cameraShot: 'Extreme Wide Shot',
        characterNames: [],
        dialogues: [
          {
            speaker: 'Narration',
            text: 'And so begins the longest night in history...',
            type: 'narration' as const,
          },
        ],
      },
    ].slice(0, params.numPanels || 4),
  };
}

export async function requestPanelImageGeneration(options: {
  panelNumber: number;
  prompt: string;
  artStyle?: string;
  characters?: string[];
  sceneLocation?: string;
  timeOfDay?: string;
  cameraShot?: string;
}): Promise<string> {
  try {
    const res = await fetch('/api/ai/panel-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.imageUrl) {
        return data.imageUrl;
      }
    }
  } catch (err) {
    console.warn('Backend image endpoint note:', err);
  }

  // High-fidelity stylized comic artwork fallback
  return generateComicSceneSVG({
    panelNumber: options.panelNumber,
    sceneDescription: options.prompt,
    location: options.sceneLocation,
    characters: options.characters,
    cameraShot: options.cameraShot,
    timeOfDay: options.timeOfDay,
    artStyle: options.artStyle,
  });
}
