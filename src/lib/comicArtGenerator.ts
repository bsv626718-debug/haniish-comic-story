/**
 * Comic Book Art Engine
 * Generates stylized comic book panel artwork in SVG data URI format
 * with dynamic scenes, characters, camera angles, Ben-Day dots, halftones,
 * speed lines, crosshatching, lighting, and cinematic framing.
 */

export function generateComicSceneSVG(options: {
  panelNumber: number;
  sceneDescription: string;
  location?: string;
  characters?: string[];
  cameraShot?: string;
  cameraAngle?: string;
  timeOfDay?: string;
  artStyle?: string;
}): string {
  const {
    panelNumber,
    sceneDescription = '',
    location = 'Headquarters',
    cameraShot = 'Long shot',
    timeOfDay = 'Evening',
  } = options;

  const desc = sceneDescription.toLowerCase();
  const isNight =
    timeOfDay.toLowerCase().includes('night') ||
    timeOfDay.toLowerCase().includes('evening') ||
    timeOfDay.toLowerCase().includes('midnight');
  const isDawn = timeOfDay.toLowerCase().includes('dawn') || timeOfDay.toLowerCase().includes('sunset');

  // Determine scene type from description & location
  const isRadarConsole =
    desc.includes('radar') ||
    desc.includes('console') ||
    desc.includes('screen') ||
    desc.includes('sensor') ||
    location.toLowerCase().includes('radar') ||
    location.toLowerCase().includes('console') ||
    panelNumber === 3;

  const isSkylineExterior =
    desc.includes('skyline') ||
    desc.includes('storm') ||
    desc.includes('cloud') ||
    desc.includes('mothership') ||
    desc.includes('dreadnought') ||
    desc.includes('rooftop') ||
    location.toLowerCase().includes('skyline') ||
    location.toLowerCase().includes('rooftop') ||
    panelNumber === 4;

  const isBackView =
    panelNumber === 2 ||
    desc.includes('rear view') ||
    desc.includes('from behind') ||
    desc.includes('back view');

  // Sky & ambient colors
  const skyColor = isNight ? '#0b1626' : isDawn ? '#2d142c' : '#1e293b';
  const glowColor = isNight ? '#0284c7' : isDawn ? '#f43f5e' : '#38bdf8';

  // 1. RADAR / TACTICAL CONSOLE SCENE (e.g. Panel 3)
  if (isRadarConsole) {
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 780" width="100%" height="100%" style="background: #050811;">
      <defs>
        <pattern id="radarGrid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#dc2626" stroke-width="0.75" opacity="0.3"/>
        </pattern>
        <radialGradient id="radarGlow" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stop-color="#ef4444" stop-opacity="0.4"/>
          <stop offset="60%" stop-color="#991b1b" stop-opacity="0.2"/>
          <stop offset="100%" stop-color="#050811" stop-opacity="0.9"/>
        </radialGradient>
      </defs>
      
      <!-- Console Background -->
      <rect width="600" height="780" fill="#090d16"/>
      <rect width="600" height="780" fill="url(#radarGlow)"/>
      <rect width="600" height="780" fill="url(#radarGrid)"/>

      <!-- Console Frame -->
      <rect x="25" y="30" width="550" height="720" rx="12" fill="#070c14" stroke="#e11d48" stroke-width="4"/>
      <rect x="40" y="50" width="520" height="420" rx="8" fill="#020617" stroke="#991b1b" stroke-width="3"/>

      <!-- Radar Rings -->
      <circle cx="300" cy="260" r="180" fill="none" stroke="#ef4444" stroke-width="2" opacity="0.4"/>
      <circle cx="300" cy="260" r="130" fill="none" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4,4" opacity="0.5"/>
      <circle cx="300" cy="260" r="80" fill="none" stroke="#ef4444" stroke-width="2" opacity="0.6"/>
      <circle cx="300" cy="260" r="30" fill="none" stroke="#ef4444" stroke-width="2" opacity="0.8"/>
      
      <!-- Crosshairs -->
      <line x1="300" y1="70" x2="300" y2="450" stroke="#f43f5e" stroke-width="2" opacity="0.6"/>
      <line x1="110" y1="260" x2="490" y2="260" stroke="#f43f5e" stroke-width="2" opacity="0.6"/>
      <line x1="170" y1="130" x2="430" y2="390" stroke="#f43f5e" stroke-width="1" stroke-dasharray="6,4" opacity="0.4"/>

      <!-- Blips / Incursion Markers (Alien Armada) -->
      <g>
        <circle cx="360" cy="180" r="9" fill="#ef4444"/>
        <circle cx="360" cy="180" r="18" fill="none" stroke="#fca5a5" stroke-width="2"/>
        <text x="375" y="185" fill="#fca5a5" font-family="monospace" font-size="12" font-weight="bold">TARGET 01 [FAST]</text>

        <circle cx="230" cy="210" r="8" fill="#ef4444"/>
        <circle cx="230" cy="210" r="16" fill="none" stroke="#fca5a5" stroke-width="2"/>
        <text x="140" y="215" fill="#fca5a5" font-family="monospace" font-size="12" font-weight="bold">TARGET 02</text>

        <circle cx="320" cy="330" r="12" fill="#dc2626"/>
        <circle cx="320" cy="330" r="24" fill="none" stroke="#f87171" stroke-width="2.5" stroke-dasharray="3,3"/>
        <text x="340" y="335" fill="#fca5a5" font-family="monospace" font-size="13" font-weight="bold">MOTHERSHIP CORE</text>
      </g>

      <!-- Alert Banners -->
      <rect x="40" y="490" width="520" height="60" fill="#450a0a" stroke="#ef4444" stroke-width="2"/>
      <text x="300" y="528" fill="#fef2f2" font-family="sans-serif" font-size="20" font-weight="900" letter-spacing="4" text-anchor="middle">WARNING: ATMOSPHERIC BREACH</text>
      <text x="300" y="544" fill="#fca5a5" font-family="monospace" font-size="10" text-anchor="middle">SECTOR 7 LOCKDOWN INITIATED</text>

      <!-- Doga Hero Silhouette Forefront in Shadow viewing Screen -->
      <path d="M 60,780 C 100,640 180,590 280,600 C 270,550 310,500 360,510 C 390,510 420,540 420,580 C 470,610 520,680 550,780 Z" fill="#030712" stroke="#000" stroke-width="8"/>
      <!-- Glowing Red Eye Slits in Silhouette -->
      <ellipse cx="340" cy="545" rx="7" ry="3.5" fill="#ffffff"/>
      <ellipse cx="370" cy="545" rx="7" ry="3.5" fill="#ffffff"/>

      <!-- Outer Comic Borders -->
      <rect x="2" y="2" width="596" height="776" fill="none" stroke="#000000" stroke-width="12"/>
      <rect x="8" y="8" width="584" height="764" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.25"/>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
  }

  // 2. CITY SKYLINE / STORMY MOTHERSHIP SCENE (e.g. Panel 4)
  if (isSkylineExterior) {
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 780" width="100%" height="100%" style="background: #090314;">
      <defs>
        <linearGradient id="stormSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#1e0b2e"/>
          <stop offset="35%" stop-color="#3b0764"/>
          <stop offset="70%" stop-color="#180728"/>
          <stop offset="100%" stop-color="#020617"/>
        </linearGradient>
        <linearGradient id="alienGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#c084fc"/>
          <stop offset="50%" stop-color="#7e22ce"/>
          <stop offset="100%" stop-color="#3b0764"/>
        </linearGradient>
        <pattern id="rainDots" width="16" height="32" patternUnits="userSpaceOnUse" patternTransform="rotate(18)">
          <line x1="0" y1="0" x2="0" y2="14" stroke="#38bdf8" stroke-width="1.2" opacity="0.4"/>
        </pattern>
      </defs>

      <!-- Storm Sky -->
      <rect width="600" height="780" fill="url(#stormSky)"/>

      <!-- Giant Alien Dreadnought Silhouette Emerging from Clouds -->
      <g id="mothership">
        <!-- Main Hull -->
        <polygon points="60,180 300,120 540,180 500,240 300,290 100,240" fill="#090514" stroke="#7e22ce" stroke-width="4"/>
        <!-- Wing Pylons -->
        <polygon points="20,200 120,230 80,260 0,220" fill="#05020a" stroke="#a855f7" stroke-width="2"/>
        <polygon points="580,200 480,230 520,260 600,220" fill="#05020a" stroke="#a855f7" stroke-width="2"/>
        <!-- Bio-Mechanical Engine Glows -->
        <ellipse cx="300" cy="275" rx="45" ry="12" fill="#c084fc" filter="drop-shadow(0 0 10px #e879f9)"/>
        <ellipse cx="200" cy="245" rx="20" ry="7" fill="#a855f7"/>
        <ellipse cx="400" cy="245" rx="20" ry="7" fill="#a855f7"/>
        <!-- Tractor Beam Ray to City -->
        <polygon points="260,285 340,285 460,780 140,780" fill="url(#alienGlow)" opacity="0.25"/>
      </g>

      <!-- Lightning Flash -->
      <polyline points="380,40 365,110 390,130 360,200" fill="none" stroke="#fbcfe8" stroke-width="3" filter="drop-shadow(0 0 8px #f43f5e)"/>

      <!-- Distant City Skyscrapers Layer 1 -->
      <g fill="#0e071c" stroke="#1f0f38" stroke-width="2">
        <rect x="20" y="380" width="60" height="400"/>
        <rect x="90" y="320" width="70" height="460"/>
        <rect x="180" y="350" width="80" height="430"/>
        <rect x="280" y="290" width="90" height="490"/>
        <rect x="390" y="340" width="75" height="440"/>
        <rect x="480" y="310" width="80" height="470"/>
      </g>

      <!-- Foreground City Skyscrapers with Illuminated Windows -->
      <g fill="#07020d" stroke="#000" stroke-width="3">
        <rect x="0" y="440" width="80" height="340"/>
        <rect x="95" y="400" width="85" height="380"/>
        <rect x="200" y="430" width="90" height="350"/>
        <rect x="310" y="390" width="95" height="390"/>
        <rect x="425" y="420" width="85" height="360"/>
        <rect x="525" y="450" width="75" height="330"/>

        <!-- Lit Windows (Yellow & Cyan) -->
        <circle cx="120" cy="450" r="2" fill="#fde047"/>
        <circle cx="140" cy="480" r="2" fill="#fde047"/>
        <circle cx="120" cy="520" r="2" fill="#38bdf8"/>
        <circle cx="330" cy="440" r="2" fill="#fde047"/>
        <circle cx="350" cy="470" r="2" fill="#fde047"/>
        <circle cx="370" cy="510" r="2" fill="#38bdf8"/>
        <circle cx="450" cy="460" r="2" fill="#fde047"/>
        <circle cx="470" cy="500" r="2" fill="#fde047"/>
      </g>

      <!-- Rain Pattern -->
      <rect width="600" height="780" fill="url(#rainDots)"/>

      <!-- Outer Comic Borders -->
      <rect x="2" y="2" width="596" height="776" fill="none" stroke="#000000" stroke-width="12"/>
      <rect x="8" y="8" width="584" height="764" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.3"/>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
  }

  // 3. HEADQUARTERS INTERIOR / CHARACTER SHOWCASES (e.g. Panels 1 & 2)
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 780" width="100%" height="100%" style="background: #080d16;">
    <defs>
      <!-- Halftone pattern -->
      <pattern id="halftone" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
        <circle cx="4" cy="4" r="1.5" fill="#224263" opacity="0.35"/>
      </pattern>
      <!-- Comic Speedlines / Ray pattern -->
      <linearGradient id="windowGlow" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.8"/>
        <stop offset="50%" stop-color="#0284c7" stop-opacity="0.6"/>
        <stop offset="100%" stop-color="#0c4a6e" stop-opacity="0.9"/>
      </linearGradient>
      <!-- Hero Suit Gradient -->
      <linearGradient id="suitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#4361ee"/>
        <stop offset="40%" stop-color="#2541b2"/>
        <stop offset="100%" stop-color="#14213d"/>
      </linearGradient>
      <!-- Shadow filter for comic pop -->
      <filter id="comicShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="3" dy="4" stdDeviation="2" flood-color="#000000" flood-opacity="0.8"/>
      </filter>
    </defs>

    <!-- Background Room / Headquarters Window -->
    <rect x="0" y="0" width="600" height="780" fill="#0b1320" />
    <rect x="0" y="0" width="600" height="780" fill="url(#halftone)" />

    <!-- Huge Central Office Window -->
    <rect x="140" y="60" width="340" height="320" fill="url(#windowGlow)" stroke="#1e293b" stroke-width="8" rx="4"/>
    
    <!-- Window Grid / Muntins -->
    <line x1="310" y1="60" x2="310" y2="380" stroke="#0f172a" stroke-width="6"/>
    <line x1="140" y1="200" x2="480" y2="200" stroke="#0f172a" stroke-width="5"/>

    <!-- Distant Cityscape Silhouette in Window -->
    <polygon points="150,380 150,290 180,290 180,240 210,240 210,380" fill="#032030"/>
    <polygon points="215,380 215,220 235,220 235,190 255,220 270,220 270,380" fill="#021824"/>
    <polygon points="275,380 275,270 300,270 300,380" fill="#032030"/>
    <polygon points="320,380 320,210 360,210 360,380" fill="#021824"/>
    <polygon points="365,380 365,250 410,250 410,380" fill="#032030"/>
    <polygon points="415,380 415,280 470,280 470,380" fill="#021824"/>
    
    <!-- Window Lit City Dots -->
    <circle cx="165" cy="270" r="1.5" fill="#fef08a"/>
    <circle cx="170" cy="310" r="1.5" fill="#fef08a"/>
    <circle cx="225" cy="240" r="1.5" fill="#38bdf8"/>
    <circle cx="245" cy="260" r="1.5" fill="#fef08a"/>
    <circle cx="340" cy="230" r="1.5" fill="#38bdf8"/>
    <circle cx="350" cy="280" r="1.5" fill="#fef08a"/>
    <circle cx="390" cy="270" r="1.5" fill="#fef08a"/>

    <!-- Left Blueprint Screen -->
    <rect x="20" y="90" width="105" height="150" fill="#0f2b46" stroke="#1e293b" stroke-width="4"/>
    <path d="M 30,120 L 70,110 L 90,140 L 40,170 Z" fill="none" stroke="#38bdf8" stroke-width="1.5" opacity="0.7"/>
    <circle cx="65" cy="135" r="18" fill="none" stroke="#38bdf8" stroke-width="1" stroke-dasharray="3,3" opacity="0.6"/>
    <line x1="30" y1="190" x2="110" y2="190" stroke="#38bdf8" stroke-width="1" opacity="0.5"/>
    <line x1="30" y1="205" x2="90" y2="205" stroke="#38bdf8" stroke-width="1" opacity="0.5"/>

    <!-- Right Tactical Map Screen -->
    <rect x="495" y="90" width="85" height="140" fill="#0f2b46" stroke="#1e293b" stroke-width="4"/>
    <line x1="505" y1="110" x2="565" y2="110" stroke="#22d3ee" stroke-width="1.5" opacity="0.7"/>
    <rect x="510" y="125" width="20" height="20" fill="none" stroke="#f43f5e" stroke-width="1.5"/>
    <circle cx="545" cy="160" r="12" fill="none" stroke="#22d3ee" stroke-width="1"/>

    <!-- Floor with Perspective Lines -->
    <polygon points="0,520 600,520 600,780 0,780" fill="#09101b" stroke="#1e293b" stroke-width="3"/>
    <line x1="60" y1="520" x2="0" y2="780" stroke="#16253b" stroke-width="3"/>
    <line x1="180" y1="520" x2="120" y2="780" stroke="#16253b" stroke-width="3"/>
    <line x1="420" y1="520" x2="480" y2="780" stroke="#16253b" stroke-width="3"/>
    <line x1="540" y1="520" x2="600" y2="780" stroke="#16253b" stroke-width="3"/>

    ${
      isBackView
        ? `
      <!-- PANEL 2: REAR VIEW OF DOGA LOOKING OUT WINDOW & ADRAK CHACHA STANDING BESIDE HIM -->
      <ellipse cx="280" cy="740" rx="90" ry="25" fill="#000000" opacity="0.8"/>
      <ellipse cx="440" cy="720" rx="60" ry="18" fill="#000000" opacity="0.8"/>

      <!-- Adrak Chacha -->
      <g id="adrak-chacha" filter="url(#comicShadow)">
        <path d="M 400,430 L 490,430 L 505,670 L 390,670 Z" fill="#4d5c43" stroke="#000" stroke-width="5"/>
        <path d="M 410,670 L 410,720 L 435,720 L 435,670 Z" fill="#2d3725" stroke="#000" stroke-width="4"/>
        <path d="M 460,670 L 460,720 L 485,720 L 485,670 Z" fill="#2d3725" stroke="#000" stroke-width="4"/>
        <path d="M 405,340 C 405,320 480,320 485,340 L 495,440 L 395,440 Z" fill="#607253" stroke="#000" stroke-width="5"/>
        <ellipse cx="445" cy="295" rx="28" ry="32" fill="#d4a373" stroke="#000" stroke-width="4"/>
        <path d="M 420,305 C 420,290 470,290 470,305 L 465,315 L 425,315 Z" fill="#cbd5e1" stroke="#000" stroke-width="3"/>
        <path d="M 395,350 L 420,410 L 435,400" stroke="#4d5c43" stroke-width="16" stroke-linecap="round" fill="none"/>
        <path d="M 480,350 L 460,410 L 445,400" stroke="#4d5c43" stroke-width="16" stroke-linecap="round" fill="none"/>
        <rect x="420" y="390" width="38" height="26" rx="3" fill="#38bdf8" stroke="#000" stroke-width="3"/>
        <path d="M 430,403 L 448,403" stroke="#ffffff" stroke-width="2"/>
      </g>

      <!-- Doga (Rear View) -->
      <g id="doga-rear" filter="url(#comicShadow)">
        <path d="M 215,530 L 260,530 L 255,730 L 210,730 Z" fill="#1e3a8a" stroke="#000" stroke-width="5"/>
        <path d="M 295,530 L 340,530 L 345,730 L 300,730 Z" fill="#1e3a8a" stroke="#000" stroke-width="5"/>
        <path d="M 205,680 L 258,680 L 258,735 L 205,735 Z" fill="#b91c1c" stroke="#000" stroke-width="4"/>
        <path d="M 298,680 L 350,680 L 350,735 L 298,735 Z" fill="#b91c1c" stroke="#000" stroke-width="4"/>
        <path d="M 180,330 C 220,310 330,310 375,330 L 340,490 L 215,490 Z" fill="#2563eb" stroke="#000" stroke-width="6"/>
        <rect x="210" y="485" width="135" height="26" fill="#f59e0b" stroke="#000" stroke-width="4" rx="3"/>
        <rect x="260" y="482" width="35" height="32" fill="#d97706" stroke="#000" stroke-width="3" rx="2"/>
        <path d="M 190,340 L 335,480" stroke="#f59e0b" stroke-width="20" stroke-linecap="round"/>
        <path d="M 190,340 L 335,480" stroke="#000" stroke-width="20" stroke-dasharray="6,8" stroke-linecap="round"/>
        <path d="M 275,330 L 275,480" stroke="#1e293b" stroke-width="12"/>
        <path d="M 180,330 C 160,370 165,450 180,490" stroke="#1d4ed8" stroke-width="28" stroke-linecap="round" fill="none"/>
        <path d="M 375,330 C 395,370 390,450 375,490" stroke="#1d4ed8" stroke-width="28" stroke-linecap="round" fill="none"/>
        <ellipse cx="180" cy="495" rx="16" ry="20" fill="#dc2626" stroke="#000" stroke-width="3"/>
        <ellipse cx="375" cy="495" rx="16" ry="20" fill="#dc2626" stroke="#000" stroke-width="3"/>
        <path d="M 245,290 C 240,240 315,240 310,290 Z" fill="#1e3a8a" stroke="#000" stroke-width="5"/>
        <polygon points="245,260 235,225 260,250" fill="#1d4ed8" stroke="#000" stroke-width="3"/>
        <polygon points="310,260 320,225 295,250" fill="#1d4ed8" stroke="#000" stroke-width="3"/>
        <line x1="250" y1="290" x2="305" y2="290" stroke="#000" stroke-width="4"/>
      </g>
      `
        : `
      <!-- PANEL 1: FRONT/HERO VIEW MATCHING SCREENSHOT EXACTLY -->
      <ellipse cx="230" cy="740" rx="110" ry="26" fill="#000000" opacity="0.8"/>
      <ellipse cx="460" cy="720" rx="60" ry="20" fill="#000000" opacity="0.8"/>

      <!-- ADRAK CHACHA (Right Side) -->
      <g id="adrak-chacha-front" filter="url(#comicShadow)">
        <path d="M 410,420 L 515,420 L 530,670 L 400,670 Z" fill="#556b2f" stroke="#000" stroke-width="5"/>
        <line x1="465" y1="420" x2="465" y2="670" stroke="#000" stroke-width="3"/>
        <rect x="420" y="670" width="30" height="45" fill="#2d3725" stroke="#000" stroke-width="4"/>
        <rect x="475" y="670" width="30" height="45" fill="#2d3725" stroke="#000" stroke-width="4"/>
        <path d="M 420,330 C 420,310 505,310 505,330 L 515,430 L 410,430 Z" fill="#6b8e23" stroke="#000" stroke-width="5"/>
        <ellipse cx="465" cy="285" rx="26" ry="30" fill="#fcd34d" stroke="#000" stroke-width="4"/>
        <path d="M 445,265 Q 465,255 485,265" stroke="#fef08a" stroke-width="3" fill="none"/>
        <ellipse cx="455" cy="280" rx="6" ry="5" fill="#fff" stroke="#000" stroke-width="2"/>
        <ellipse cx="475" cy="280" rx="6" ry="5" fill="#fff" stroke="#000" stroke-width="2"/>
        <circle cx="456" cy="280" r="2.5" fill="#000"/>
        <circle cx="474" cy="280" r="2.5" fill="#000"/>
        <path d="M 445,295 Q 465,290 485,295 Q 465,308 445,295 Z" fill="#e2e8f0" stroke="#000" stroke-width="2.5"/>
        <rect x="440" y="380" width="46" height="34" rx="4" fill="#0ea5e9" stroke="#000" stroke-width="3"/>
        <path d="M 446,392 L 476,392" stroke="#fff" stroke-width="2.5"/>
        <circle cx="463" cy="402" r="4" fill="#38bdf8"/>
        <path d="M 415,340 L 440,390" stroke="#556b2f" stroke-width="18" stroke-linecap="round" fill="none"/>
        <path d="M 505,340 L 485,390" stroke="#556b2f" stroke-width="18" stroke-linecap="round" fill="none"/>
      </g>

      <!-- DOGA (Front) -->
      <g id="doga-front" filter="url(#comicShadow)">
        <path d="M 170,510 L 225,510 L 215,730 L 160,730 Z" fill="#1d4ed8" stroke="#000" stroke-width="6"/>
        <path d="M 245,510 L 300,510 L 310,730 L 255,730 Z" fill="#1d4ed8" stroke="#000" stroke-width="6"/>
        <line x1="165" y1="560" x2="225" y2="560" stroke="#000" stroke-width="5"/>
        <line x1="250" y1="560" x2="305" y2="560" stroke="#000" stroke-width="5"/>
        <path d="M 150,660 L 220,660 L 220,735 L 140,735 Z" fill="#b91c1c" stroke="#000" stroke-width="5"/>
        <path d="M 250,660 L 320,660 L 325,735 L 245,735 Z" fill="#b91c1c" stroke="#000" stroke-width="5"/>
        <rect x="155" y="680" width="60" height="8" fill="#fbbf24" stroke="#000" stroke-width="2"/>
        <rect x="255" y="680" width="60" height="8" fill="#fbbf24" stroke="#000" stroke-width="2"/>
        <path d="M 140,300 C 190,290 290,290 330,300 L 290,480 L 180,480 Z" fill="url(#suitGrad)" stroke="#000" stroke-width="6"/>
        <path d="M 190,340 C 235,360 250,360 280,340" stroke="#0f172a" stroke-width="4" fill="none"/>
        <line x1="235" y1="340" x2="235" y2="470" stroke="#0f172a" stroke-width="4"/>
        <line x1="205" y1="400" x2="265" y2="400" stroke="#0f172a" stroke-width="3"/>
        <line x1="205" y1="440" x2="265" y2="440" stroke="#0f172a" stroke-width="3"/>
        <path d="M 120,440 L 155,440 L 150,510 L 115,510 Z" fill="#b91c1c" stroke="#000" stroke-width="5"/>
        <path d="M 320,420 L 355,420 L 360,490 L 325,490 Z" fill="#b91c1c" stroke="#000" stroke-width="5"/>
        <path d="M 145,300 L 285,475" stroke="#f59e0b" stroke-width="18" stroke-linecap="round"/>
        <path d="M 145,300 L 285,475" stroke="#000" stroke-width="18" stroke-dasharray="5,6" stroke-linecap="round"/>
        <path d="M 320,300 L 185,475" stroke="#f59e0b" stroke-width="18" stroke-linecap="round"/>
        <path d="M 320,300 L 185,475" stroke="#000" stroke-width="18" stroke-dasharray="5,6" stroke-linecap="round"/>
        <rect x="175" y="475" width="120" height="24" fill="#fbbf24" stroke="#000" stroke-width="4" rx="2"/>
        <rect x="220" y="470" width="30" height="32" fill="#d97706" stroke="#000" stroke-width="3" rx="2"/>

        <g id="rifle" transform="rotate(-28 230 410)">
          <rect x="140" y="400" width="180" height="22" fill="#334155" stroke="#000" stroke-width="4"/>
          <rect x="100" y="405" width="45" height="12" fill="#1e293b" stroke="#000" stroke-width="3"/>
          <rect x="150" y="420" width="30" height="35" fill="#1e293b" stroke="#000" stroke-width="3"/>
          <rect x="230" y="390" width="50" height="12" fill="#64748b" stroke="#000" stroke-width="2"/>
          <circle cx="102" cy="411" r="5" fill="#000"/>
        </g>

        <path d="M 205,255 C 200,205 270,205 265,255 Z" fill="#1e3a8a" stroke="#000" stroke-width="5"/>
        <polygon points="205,225 195,190 225,215" fill="#1d4ed8" stroke="#000" stroke-width="4"/>
        <polygon points="265,225 275,190 245,215" fill="#1d4ed8" stroke="#000" stroke-width="4"/>
        <ellipse cx="222" cy="245" rx="10" ry="6" fill="#ffffff" stroke="#000" stroke-width="3"/>
        <ellipse cx="248" cy="245" rx="10" ry="6" fill="#ffffff" stroke="#000" stroke-width="3"/>
        <path d="M 235,245 L 235,268 L 228,272 L 242,272 Z" fill="#0f172a" stroke="#000" stroke-width="2"/>
        <path d="M 224,280 L 246,280" stroke="#fff" stroke-width="4" stroke-dasharray="4,2"/>
      </g>
      `
    }

    <!-- Comic Panel Ink Border Framing -->
    <rect x="2" y="2" width="596" height="776" fill="none" stroke="#000000" stroke-width="12"/>
    <rect x="8" y="8" width="584" height="764" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.3"/>

    <!-- Subtle Vignette / Comic Ink Edge -->
    <rect x="0" y="740" width="600" height="40" fill="url(#comicShadow)" opacity="0.4"/>
  </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}
