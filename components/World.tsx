'use client'

const C = {
  skyTop: '#7BAEC8',
  skyHorizon: '#A8C6DC',
  sunGlow: '#F8E8B0',
  sun: '#F2D46A',
  cloud: '#EDE8DC',
  oceanFar: '#79ADCA',
  oceanMid: '#5B8FAA',
  oceanNear: '#3E7090',
  waterShimmer: '#8CC4DC',
  grassGreen: '#8BAC7E',
  grassDark: '#6A8A5E',
  stoneWarm: '#C4A87A',
  stoneDark: '#A08858',
  houseCream: '#E8C49A',
  houseSide: '#C4A07A',
  houseDeep: '#A07A50',
  roofTile: '#C47850',
  roofSide: '#9A5830',
  doorBrown: '#7A5030',
  windowWarm: '#F0E8C0',
  windowInner: '#D4C890',
  towerCream: '#DEB888',
  towerSide: '#B89060',
  stepStone: '#C0A878',
  stepSide: '#9A8050',
  forestDark: '#4A7040',
  forestMid: '#5A8050',
  forestLight: '#7AAA6A',
  islandBack: '#7A9A6E',
  boatHull: '#C47050',
  boatDark: '#9A5030',
  boatOar: '#8B6040',
  pathStone: '#C8B080',
  chimney: '#B09060',
}

interface WorldProps {
  onEnterHouse: () => void
  onDive: () => void
  onRowToForest: () => void
}

export default function World({ onEnterHouse, onDive, onRowToForest }: WorldProps) {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <svg
        viewBox="0 0 1200 800"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', display: 'block' }}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <style>{`
            .zone { cursor: pointer; }
            .zone:hover rect, .zone:hover ellipse, .zone:hover polygon, .zone:hover path {
              filter: brightness(1.04);
            }
            @keyframes driftA {
              0% { transform: translateX(0px); }
              100% { transform: translateX(28px); }
            }
            @keyframes driftB {
              0% { transform: translateX(0px); }
              100% { transform: translateX(-22px); }
            }
            @keyframes bob {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-5px); }
            }
            @keyframes shimmer {
              0%, 100% { opacity: 0.18; }
              50% { opacity: 0.38; }
            }
            @keyframes glow {
              0%, 100% { opacity: 0.32; }
              50% { opacity: 0.45; }
            }
            .cloud-a { animation: driftA 14s ease-in-out infinite alternate; }
            .cloud-b { animation: driftB 20s ease-in-out infinite alternate; }
            .cloud-c { animation: driftA 10s ease-in-out infinite alternate-reverse; }
            .boat-group { animation: bob 3.5s ease-in-out infinite; transform-origin: 215px 515px; }
            .shimmer { animation: shimmer 3s ease-in-out infinite; }
            .sun-glow { animation: glow 4s ease-in-out infinite; }
            .hint-text {
              font-family: Georgia, serif;
              font-size: 13px;
              letter-spacing: 2px;
              pointer-events: none;
              user-select: none;
            }
          `}</style>
        </defs>

        {/* ── SKY ── flat Avery color bands */}
        <rect x="0" y="0" width="1200" height="800" fill={C.skyTop} />
        <rect x="0" y="340" width="1200" height="130" fill={C.skyHorizon} />

        {/* ── SUN ── */}
        <circle cx="930" cy="108" r="72" fill={C.sunGlow} className="sun-glow" />
        <circle cx="930" cy="108" r="52" fill={C.sun} />

        {/* ── CLOUDS ── flat Avery blob shapes */}
        <g className="cloud-a">
          <ellipse cx="178" cy="148" rx="72" ry="28" fill={C.cloud} />
          <ellipse cx="218" cy="132" rx="48" ry="22" fill={C.cloud} />
          <ellipse cx="148" cy="140" rx="40" ry="20" fill={C.cloud} />
        </g>
        <g className="cloud-b">
          <ellipse cx="530" cy="86" rx="58" ry="22" fill={C.cloud} opacity="0.78" />
          <ellipse cx="568" cy="72" rx="38" ry="18" fill={C.cloud} opacity="0.78" />
          <ellipse cx="500" cy="80" rx="32" ry="16" fill={C.cloud} opacity="0.78" />
        </g>
        <g className="cloud-c">
          <ellipse cx="760" cy="178" rx="44" ry="18" fill={C.cloud} opacity="0.55" />
          <ellipse cx="793" cy="166" rx="28" ry="15" fill={C.cloud} opacity="0.55" />
        </g>

        {/* ── OCEAN ── three flat Avery color bands */}
        <rect x="0" y="456" width="1200" height="88" fill={C.oceanFar} />
        <rect x="0" y="534" width="1200" height="108" fill={C.oceanMid} />
        <rect x="0" y="636" width="1200" height="164" fill={C.oceanNear} />

        {/* Water shimmer highlights */}
        <ellipse cx="200" cy="490" rx="90" ry="8" fill={C.waterShimmer} className="shimmer" />
        <ellipse cx="800" cy="510" rx="70" ry="6" fill={C.waterShimmer} className="shimmer" style={{ animationDelay: '1.2s' }} />
        <ellipse cx="500" cy="570" rx="120" ry="8" fill={C.waterShimmer} className="shimmer" style={{ animationDelay: '0.6s' }} />

        {/* ── FOREST ISLAND (background right) ── */}
        <g>
          {/* Stone base */}
          <polygon
            points="855,470 870,458 1060,458 1075,472 1060,498 868,498"
            fill={C.stoneDark}
          />
          {/* Grass top */}
          <ellipse cx="965" cy="456" rx="98" ry="24" fill={C.islandBack} />
          {/* Trees — flat Avery triangle masses */}
          <polygon points="882,390 908,452 856,452" fill={C.forestDark} />
          <polygon points="882,402 905,452 860,452" fill={C.forestMid} />
          <polygon points="888,408 904,452 872,452" fill={C.forestLight} opacity="0.4" />

          <polygon points="932,372 962,452 902,452" fill={C.forestDark} />
          <polygon points="932,386 958,452 906,452" fill={C.forestMid} />
          <polygon points="938,392 956,452 920,452" fill={C.forestLight} opacity="0.4" />

          <polygon points="980,382 1008,452 952,452" fill={C.forestDark} />
          <polygon points="980,394 1004,452 956,452" fill={C.forestMid} />
          <polygon points="986,400 1002,452 970,452" fill={C.forestLight} opacity="0.4" />

          <polygon points="1028,394 1050,452 1006,452" fill={C.forestDark} />
          <polygon points="1028,405 1047,452 1010,452" fill={C.forestMid} />

          {/* Clickable zone */}
          <g className="zone" onClick={onRowToForest} style={{ cursor: 'pointer' }}>
            <ellipse cx="965" cy="420" rx="115" ry="75" fill="transparent" />
          </g>
        </g>

        {/* Forest island hint */}
        <text x="965" y="500" textAnchor="middle" fill={C.grassDark} className="hint-text" opacity="0.55">
          forest island
        </text>

        {/* ── MAIN FLOATING ISLAND ── */}
        <g>
          {/* Island shadow on water */}
          <ellipse cx="548" cy="495" rx="210" ry="22" fill={C.oceanMid} opacity="0.5" />

          {/* Stone underside — geometric hanging rock (Monument Valley) */}
          <polygon
            points="345,438 395,458 555,472 715,456 760,432 744,540 548,562 352,542"
            fill={C.stoneDark}
          />
          {/* Stone face front highlight band */}
          <polygon
            points="352,450 395,458 555,472 715,456 744,464 548,480 395,465 352,458"
            fill={C.stoneWarm}
          />
          {/* Geometric stone face detail — vertical cracks */}
          <line x1="430" y1="458" x2="420" y2="540" stroke={C.stoneDark} strokeWidth="1.5" opacity="0.3" />
          <line x1="548" y1="472" x2="545" y2="560" stroke={C.stoneDark} strokeWidth="1.5" opacity="0.3" />
          <line x1="660" y1="460" x2="658" y2="540" stroke={C.stoneDark} strokeWidth="1.5" opacity="0.3" />

          {/* Grass top — irregular organic polygon */}
          <polygon
            points="338,420 392,400 510,386 650,382 755,402 762,428 715,448 558,462 398,450 332,434"
            fill={C.grassGreen}
          />
          {/* Grass shading — shadow on left side */}
          <polygon
            points="338,420 392,400 430,398 420,418 360,432"
            fill={C.grassDark}
            opacity="0.25"
          />
          {/* Small grass texture marks */}
          <line x1="460" y1="390" x2="462" y2="400" stroke={C.grassDark} strokeWidth="2" opacity="0.3" />
          <line x1="600" y1="386" x2="602" y2="396" stroke={C.grassDark} strokeWidth="2" opacity="0.3" />
          <line x1="700" y1="396" x2="702" y2="406" stroke={C.grassDark} strokeWidth="2" opacity="0.3" />
        </g>

        {/* ── HOUSE COMPOUND (Monument Valley style) ── */}
        <g>

          {/* === LOWER PLATFORM / TERRACE === */}
          {/* Terrace top face */}
          <polygon points="430,348 640,334 672,355 462,372" fill={C.houseSide} />
          {/* Terrace front face */}
          <rect x="430" y="348" width="32" height="28" fill={C.houseDeep} opacity="0.6" />
          <rect x="462" y="372" width="210" height="20" fill={C.houseSide} opacity="0.7" />
          {/* Terrace side face */}
          <polygon points="640,334 672,355 672,375 640,354" fill={C.houseDeep} opacity="0.5" />

          {/* === STAIRCASE (wraps around left side — Monument Valley impossible feel) === */}
          {/* Steps front */}
          <rect x="540" y="388" width="88" height="14" fill={C.stepStone} />
          <rect x="548" y="374" width="76" height="15" fill={C.stepStone} />
          <rect x="558" y="362" width="62" height="13" fill={C.stepStone} />
          <rect x="564" y="350" width="56" height="13" fill={C.stepStone} />
          <rect x="570" y="339" width="50" height="12" fill={C.stepStone} />
          {/* Steps side faces (isometric depth) */}
          <polygon points="628,388 648,381 648,395 628,402" fill={C.stepSide} />
          <polygon points="624,374 642,368 642,381 624,388" fill={C.stepSide} />
          <polygon points="620,362 636,356 636,368 620,374" fill={C.stepSide} />
          <polygon points="620,350 634,345 634,356 620,362" fill={C.stepSide} />
          <polygon points="620,339 632,334 632,345 620,350" fill={C.stepSide} />

          {/* === LEFT TOWER === */}
          {/* Tower back/top cap */}
          <polygon points="418,194 510,194 548,180 456,180" fill={C.roofTile} />
          {/* Tower front face */}
          <rect x="418" y="194" width="92" height="200" fill={C.towerCream} />
          {/* Tower side face */}
          <polygon points="510,194 548,180 548,374 510,394" fill={C.towerSide} />
          {/* Tower battlements */}
          <rect x="418" y="186" width="22" height="14" fill={C.towerCream} />
          <rect x="450" y="186" width="22" height="14" fill={C.towerCream} />
          <rect x="482" y="186" width="28" height="14" fill={C.towerCream} />
          {/* Tower windows */}
          <rect x="445" y="228" width="34" height="42" fill={C.windowWarm} rx="2" />
          <rect x="460" y="228" width="4" height="42" fill={C.windowInner} opacity="0.6" />
          <rect x="445" y="247" width="34" height="4" fill={C.windowInner} opacity="0.6" />
          <rect x="448" y="304" width="30" height="36" fill={C.windowWarm} rx="2" />
          <rect x="461" y="304" width="4" height="36" fill={C.windowInner} opacity="0.6" />

          {/* === MAIN BUILDING === */}
          {/* Roof top face */}
          <polygon points="506,210 698,210 738,196 546,196" fill={C.roofTile} />
          {/* Roof side face */}
          <polygon points="698,210 738,196 738,218 698,232" fill={C.roofSide} />
          {/* Roof front edge */}
          <rect x="506" y="208" width="192" height="8" fill={C.roofSide} />
          {/* Main front face */}
          <rect x="506" y="216" width="192" height="188" fill={C.houseCream} />
          {/* Side face */}
          <polygon points="698,216 738,200 738,390 698,404" fill={C.houseSide} />

          {/* Main building windows */}
          {/* Left window */}
          <rect x="516" y="248" width="56" height="58" fill={C.windowWarm} rx="2" />
          <rect x="542" y="248" width="4" height="58" fill={C.windowInner} opacity="0.6" />
          <rect x="516" y="275" width="56" height="4" fill={C.windowInner} opacity="0.6" />
          {/* Right window */}
          <rect x="626" y="248" width="52" height="58" fill={C.windowWarm} rx="2" />
          <rect x="650" y="248" width="4" height="58" fill={C.windowInner} opacity="0.6" />
          <rect x="626" y="275" width="52" height="4" fill={C.windowInner} opacity="0.6" />
          {/* Upper windows */}
          <rect x="526" y="222" width="38" height="26" fill={C.windowWarm} rx="1" />
          <rect x="622" y="219" width="36" height="26" fill={C.windowWarm} rx="1" />

          {/* Door — arched, Monument Valley style */}
          <rect x="576" y="330" width="62" height="74" fill={C.doorBrown} />
          <path d="M 576 330 Q 607 300 638 330" fill={C.doorBrown} />
          {/* Door recess detail */}
          <rect x="582" y="336" width="50" height="60" fill={C.houseDeep} opacity="0.25" rx="1" />

          {/* Small chimney */}
          <rect x="648" y="170" width="22" height="42" fill={C.chimney} />
          <rect x="644" y="166" width="30" height="9" fill={C.roofSide} />
          {/* Chimney smoke — tiny circles */}
          <circle cx="659" cy="158" r="4" fill={C.skyHorizon} opacity="0.4" />
          <circle cx="663" cy="148" r="3" fill={C.skyHorizon} opacity="0.25" />

          {/* Small potted plant by door */}
          <rect x="562" y="378" width="14" height="14" fill={C.stoneWarm} rx="2" />
          <ellipse cx="569" cy="374" rx="10" ry="7" fill={C.grassGreen} />
          <ellipse cx="569" cy="370" rx="7" ry="5" fill={C.grassDark} opacity="0.6" />

          {/* Connecting walkway from terrace to grass */}
          <polygon points="462,390 540,388 540,402 462,404" fill={C.pathStone} />
          <polygon points="462,390 462,404 450,400 450,388" fill={C.stepSide} opacity="0.6" />
        </g>

        {/* House clickable zone */}
        <g className="zone" onClick={onEnterHouse} style={{ cursor: 'pointer' }}>
          <rect x="410" y="175" width="345" height="240" fill="transparent" />
        </g>
        {/* Enter hint */}
        <text x="588" y="170" textAnchor="middle" fill={C.towerSide} className="hint-text" opacity="0.5">
          enter
        </text>

        {/* ── BOAT (left, bobbing) ── */}
        <g className="boat-group">
          {/* Hull */}
          <path d="M 162 508 Q 215 492 268 508 L 256 538 Q 215 550 174 538 Z" fill={C.boatHull} />
          {/* Hull rim */}
          <path d="M 168 532 Q 215 542 262 532" fill="none" stroke={C.boatDark} strokeWidth="2" opacity="0.5" />
          {/* Hull dark bottom */}
          <path d="M 174 538 Q 215 550 256 538 Q 215 546 174 538" fill={C.boatDark} opacity="0.3" />
          {/* Left oar */}
          <line x1="182" y1="510" x2="158" y2="542" stroke={C.boatOar} strokeWidth="4" strokeLinecap="round" />
          <ellipse cx="152" cy="546" rx="10" ry="4" fill={C.boatOar} transform="rotate(-30, 152, 546)" />
          {/* Right oar */}
          <line x1="248" y1="510" x2="272" y2="542" stroke={C.boatOar} strokeWidth="4" strokeLinecap="round" />
          <ellipse cx="278" cy="546" rx="10" ry="4" fill={C.boatOar} transform="rotate(30, 278, 546)" />
        </g>

        {/* Row-to-forest clickable zone (boat area) */}
        <g className="zone" onClick={onRowToForest} style={{ cursor: 'pointer' }}>
          <ellipse cx="215" cy="520" rx="80" ry="45" fill="transparent" />
        </g>

        {/* ── DIVE ZONE ── */}
        <g className="zone" onClick={onDive} style={{ cursor: 'pointer' }}>
          <rect x="360" y="492" width="400" height="100" fill="transparent" />
        </g>
        {/* Dive hint */}
        <text x="560" y="590" textAnchor="middle" fill={C.oceanFar} className="hint-text" opacity="0.45">
          ~ dive ~
        </text>

      </svg>
    </div>
  )
}
