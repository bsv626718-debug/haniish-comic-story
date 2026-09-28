import { ComicProject } from '../types/comic';
import { generateComicSceneSVG } from './comicArtGenerator';

// Character avatar thumbnails
const dogaAvatar = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <rect width="100" height="100" fill="#1e293b"/>
  <circle cx="50" cy="50" r="42" fill="#1d4ed8"/>
  <polygon points="32,35 24,15 42,28" fill="#1e40af"/>
  <polygon points="68,35 76,15 58,28" fill="#1e40af"/>
  <path d="M 30,55 C 30,35 70,35 70,55 L 65,75 L 35,75 Z" fill="#172554"/>
  <ellipse cx="42" cy="52" rx="7" ry="4" fill="#ffffff"/>
  <ellipse cx="58" cy="52" rx="7" ry="4" fill="#ffffff"/>
  <path d="M 44,70 L 56,70" stroke="#f43f5e" stroke-width="3"/>
  <circle cx="50" cy="50" r="48" fill="none" stroke="#f43f5e" stroke-width="2"/>
</svg>
`)}`;

const adrakAvatar = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <rect width="100" height="100" fill="#142017"/>
  <circle cx="50" cy="46" r="32" fill="#fcd34d"/>
  <ellipse cx="40" cy="45" rx="5" ry="4" fill="#fff" stroke="#000" stroke-width="2"/>
  <ellipse cx="60" cy="45" rx="5" ry="4" fill="#fff" stroke="#000" stroke-width="2"/>
  <circle cx="41" cy="45" r="2" fill="#000"/>
  <circle cx="59" cy="45" r="2" fill="#000"/>
  <path d="M 32,58 Q 50,50 68,58 Q 50,72 32,58 Z" fill="#e2e8f0" stroke="#000" stroke-width="2"/>
  <path d="M 25,85 C 25,75 75,75 75,85 L 80,100 L 20,100 Z" fill="#556b2f"/>
  <circle cx="50" cy="50" r="48" fill="none" stroke="#22c55e" stroke-width="2"/>
</svg>
`)}`;

export const initialProject: ComicProject = {
  id: 'comic-attack-ets-01',
  title: 'The Attack of the ETs',
  description: 'An extraterrestrial armada enters orbit over Metropolis. Doga and his tactician Adrak Chacha prepare for the inevitable clash.',
  genre: 'Superhero / Sci-Fi',
  artStyle: 'Retro 90s Graphic Novel',
  characters: [
    {
      id: 'char-doga',
      name: 'Doga',
      role: 'Vigilante Hero & Protector',
      avatar: dogaAvatar,
      appearance: 'Muscular hero in blue tactical bodysuit, masked canine cowl, crossed ammunition bandoliers, combat rifle.',
      clothing: 'Blue tactical suit, crossed yellow ammo belts, red combat boots and gauntlets.',
      personality: 'Uncompromising, vigilant, fearless defender of the downtrodden.',
      powers: 'Peak human conditioning, martial arts mastery, tactical marksman, iron will.'
    },
    {
      id: 'char-adrak',
      name: 'Adrak Chacha',
      role: 'Mentor & Tactical Strategist',
      avatar: adrakAvatar,
      appearance: 'Elderly gentleman with bald head, prominent handlebar mustache, carrying an intelligence datapad.',
      clothing: 'Olive green traditional kurta / tactical robe.',
      personality: 'Calm, sharp intellect, cautious mentor with deep strategic insight.',
      powers: 'High-tech hacker, intelligence broker, master planner.'
    }
  ],
  stories: [
    {
      id: 'story-1',
      title: 'What are they?',
      synopsis: 'Alien signals penetrate the defense grid. In the quiet hours of his hidden bunker, Doga uncovers the Abyss Protocol.',
      panels: [
        {
          id: 'panel-1',
          panelNumber: 1,
          description: 'Doga is looking worried and thinking about the future of his city. Adrak chacha is sneaking on him from a far coner of his office.',
          sceneLocation: 'Doga Headquart...',
          timeOfDay: 'Evening',
          cameraAngle: 'Wide Angle',
          cameraShot: 'Long shot',
          characterIds: ['char-doga', 'char-adrak'],
          dialogues: [
            {
              id: 'diag-1',
              speaker: 'Doga',
              text: "The reports...they can't be true, chacha!",
              type: 'speech',
              position: { x: 74, y: 7 }
            },
            {
              id: 'diag-2',
              speaker: 'Adrak Chacha',
              text: 'They are, "Abyss protocol" could consume the city...possibly the world!',
              type: 'speech',
              position: { x: 84, y: 15 }
            }
          ],
          imageUrl: generateComicSceneSVG({
            panelNumber: 1,
            sceneDescription: 'Doga is looking worried and thinking about the future of his city. Adrak chacha is sneaking on him from a far coner of his office.',
            location: 'Doga Headquarters',
            timeOfDay: 'Evening',
            cameraShot: 'Long shot'
          }),
          aspectRatio: '3:4'
        },
        {
          id: 'panel-2',
          panelNumber: 2,
          description: 'Rear view of Doga standing before the grand observation window looking out at the sprawling skyline under evening gloom. Adrak Chacha stands beside him scanning orbital signatures on his datapad.',
          sceneLocation: 'Doga Headquart...',
          timeOfDay: 'Night',
          cameraAngle: 'Eye Level',
          cameraShot: 'Medium shot',
          characterIds: ['char-doga', 'char-adrak'],
          dialogues: [
            {
              id: 'diag-3',
              speaker: 'Doga',
              text: "If they step one foot into this city, they'll learn we fight back.",
              type: 'speech',
              position: { x: 30, y: 8 }
            },
            {
              id: 'diag-4',
              speaker: 'Adrak Chacha',
              text: "Careful son, their mothership outclasses our defenses ten to one.",
              type: 'speech',
              position: { x: 76, y: 16 }
            }
          ],
          imageUrl: generateComicSceneSVG({
            panelNumber: 2,
            sceneDescription: 'Rear view of Doga standing before window looking at city with Adrak Chacha',
            location: 'Doga Headquarters',
            timeOfDay: 'Night',
            cameraShot: 'Medium shot'
          }),
          aspectRatio: '3:4'
        },
        {
          id: 'panel-3',
          panelNumber: 3,
          description: 'Close-up of the tactical console screen strobing red. Atmospheric sensors detect three cloaked scout crafts entering lower stratosphere.',
          sceneLocation: 'Tactical Radar Console',
          timeOfDay: 'Night',
          cameraAngle: 'Low Angle',
          cameraShot: 'Close-up',
          characterIds: ['char-doga'],
          dialogues: [
            {
              id: 'diag-5',
              speaker: 'Doga',
              text: 'Sound the general alarm. Lockdown sector 7!',
              type: 'shout',
              position: { x: 45, y: 12 }
            }
          ],
          imageUrl: generateComicSceneSVG({
            panelNumber: 3,
            sceneDescription: 'Tactical holographic radar display glowing red with incoming alien spacecraft',
            location: 'Tactical Console',
            timeOfDay: 'Night',
            cameraShot: 'Close-up'
          }),
          aspectRatio: '3:4'
        },
        {
          id: 'panel-4',
          panelNumber: 4,
          description: 'Exterior shot of the city under a menacing purple storm. Giant ominous silhouettes eclipse the crescent moon as raindrops hit the camera lens.',
          sceneLocation: 'City Skyline Rooftops',
          timeOfDay: 'Midnight',
          cameraAngle: 'Dutch Tilt',
          cameraShot: 'Extreme Wide Shot',
          characterIds: [],
          dialogues: [
            {
              id: 'diag-6',
              speaker: 'Narration',
              text: 'And so begins the longest night in history...',
              type: 'narration',
              position: { x: 50, y: 8 }
            }
          ],
          imageUrl: generateComicSceneSVG({
            panelNumber: 4,
            sceneDescription: 'Dark stormy metropolis skyline with alien dreadnought emerging through purple thunder clouds',
            location: 'Skyline',
            timeOfDay: 'Midnight',
            cameraShot: 'Extreme Wide Shot'
          }),
          aspectRatio: '3:4'
        }
      ]
    },
    {
      id: 'story-2',
      title: 'Untitled',
      synopsis: 'Chapter 2: The defense commences.',
      panels: [
        {
          id: 'panel-201',
          panelNumber: 1,
          description: 'Doga charges his particle carbine on the rooftop as the sky turns neon violet.',
          sceneLocation: 'Rooftops',
          timeOfDay: 'Dawn',
          cameraAngle: 'Low Angle',
          cameraShot: 'Medium Shot',
          characterIds: ['char-doga'],
          dialogues: [
            {
              id: 'diag-201',
              speaker: 'Doga',
              text: 'Time to hunt.',
              type: 'speech',
              position: { x: 50, y: 12 }
            }
          ],
          imageUrl: generateComicSceneSVG({
            panelNumber: 1,
            sceneDescription: 'Hero on rooftop at dawn ready for battle',
            location: 'Rooftops',
            timeOfDay: 'Dawn',
            cameraShot: 'Medium Shot'
          }),
          aspectRatio: '3:4'
        }
      ]
    }
  ],
  activeStoryId: 'story-1',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};
