'use client'

import { useState, useEffect } from 'react'
import { client, urlFor } from '@/lib/sanity'
import { allEntriesQuery } from '@/lib/queries'

const IC = {
  floor: '#C4A882',
  floorPlank: '#A88A68',
  wall: '#E8D4B8',
  wallSide: '#D8C4A4',
  ceiling: '#D0BC9C',
  sofa: '#788098',
  sofaLight: '#9AAAB8',
  sofaDark: '#5A6878',
  sofaArm: '#526070',
  window: '#F8F4E0',
  windowGlow: '#FFF8E8',
  windowFrame: '#8B6040',
  windowView: '#A8C8E0',
  windowViewGround: '#8AAF7E',
  shelf: '#8B6040',
  shelfDark: '#6A4828',
  rug: '#A87860',
  rugDark: '#885040',
  tv: '#2A3038',
  tvScreen: '#3A5868',
  tvOn: '#5A8898',
  cabinet: '#8B6040',
  cabinetDark: '#6A4828',
  plant: '#6A9060',
  plantDark: '#486840',
  plantPot: '#C08050',
  frame: '#7A5030',
  canvas: '#E0C890',
  table: '#8B6040',
  tableDark: '#6A4828',
  door: '#C4A07A',
  doorFrame: '#8B6040',
  mug: '#C08050',
  bookColors: [
    '#C47850', '#7A8FA0', '#8AAF7E', '#D4A860',
    '#A07888', '#6A8888', '#C49060', '#7090A0',
    '#A88060', '#9080A8', '#70A878', '#C8906A',
  ],
}

interface Entry {
  _id: string
  title: string
  entryType: 'book' | 'movie' | 'artwork' | 'photo' | 'thought' | 'character' | 'music'
  description?: string
  image?: { asset: { _ref: string } }
  date?: string
  tags?: string[]
}

export default function HouseInterior({ onExit }: { onExit: () => void }) {
  const [entries, setEntries] = useState<Entry[]>([])
  const [selected, setSelected] = useState<Entry | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    client.fetch<Entry[]>(allEntriesQuery)
      .then(data => { setEntries(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const books = entries.filter(e => e.entryType === 'book' || e.entryType === 'thought')
  const movies = entries.filter(e => e.entryType === 'movie' || e.entryType === 'music')
  const artworks = entries.filter(e => e.entryType === 'artwork' || e.entryType === 'photo')

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <svg
        viewBox="0 0 1200 800"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', display: 'block' }}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <style>{`
            .obj { cursor: pointer; }
            .obj:hover { filter: brightness(1.06); }
            .hint {
              font-family: Georgia, serif;
              font-size: 11px;
              letter-spacing: 2px;
              pointer-events: none;
              user-select: none;
            }
            @keyframes warmGlow {
              0%, 100% { opacity: 0.85; }
              50% { opacity: 1; }
            }
            .window-light { animation: warmGlow 5s ease-in-out infinite; }
          `}</style>
        </defs>

        {/* ── CEILING ── */}
        <rect x="0" y="0" width="1200" height="118" fill={IC.ceiling} />

        {/* ── BACK WALL ── warm Avery cream */}
        <rect x="0" y="118" width="1200" height="522" fill={IC.wall} />

        {/* ── SIDE WALLS (give depth) ── */}
        <polygon points="0,0 130,55 130,748 0,800" fill={IC.wallSide} />
        <polygon points="1200,0 1070,55 1070,748 1200,800" fill={IC.wallSide} />

        {/* ── FLOOR ── warm Avery sand */}
        <polygon points="0,640 1200,640 1200,800 0,800" fill={IC.floor} />
        {/* Floor planks */}
        {[650, 663, 676, 689, 702, 716, 730, 745, 760, 776].map((y, i) => (
          <line key={i} x1="0" y1={y} x2="1200" y2={y}
            stroke={IC.floorPlank} strokeWidth="1" opacity="0.18" />
        ))}
        {/* Floor shading — darkens near edges */}
        <polygon points="0,640 130,640 130,800 0,800" fill={IC.floorPlank} opacity="0.15" />
        <polygon points="1070,640 1200,640 1200,800 1070,800" fill={IC.floorPlank} opacity="0.15" />

        {/* ── RUG (Avery terracotta) ── */}
        <ellipse cx="600" cy="688" rx="340" ry="52" fill={IC.rug} />
        <ellipse cx="600" cy="688" rx="308" ry="44" fill="none" stroke={IC.rugDark} strokeWidth="3" opacity="0.35" />
        <ellipse cx="600" cy="688" rx="270" ry="36" fill="none" stroke={IC.rugDark} strokeWidth="1.5" opacity="0.25" />

        {/* ── WINDOW (center-back wall, warm Avery light) ── */}
        <rect x="716" y="142" width="238" height="310" fill={IC.windowFrame} />
        <rect x="728" y="154" width="214" height="286" fill={IC.windowGlow} className="window-light" />
        {/* Window view: simple Avery landscape */}
        <rect x="728" y="154" width="214" height="145" fill={IC.windowView} opacity="0.7" />
        <rect x="728" y="278" width="214" height="162" fill={IC.windowViewGround} opacity="0.45" />
        {/* Window cross bars */}
        <rect x="828" y="154" width="8" height="286" fill={IC.windowFrame} opacity="0.55" />
        <rect x="728" y="295" width="214" height="8" fill={IC.windowFrame} opacity="0.55" />
        {/* Window sill */}
        <rect x="714" y="452" width="242" height="20" fill={IC.windowFrame} />
        {/* Window sill object — small vase */}
        <rect x="812" y="438" width="16" height="16" fill={IC.plantPot} rx="2" />
        <ellipse cx="820" cy="435" rx="10" ry="7" fill={IC.plant} />

        {/* ── BOOKSHELF (left wall area) ── */}
        {/* Shelf unit back */}
        <rect x="72" y="148" width="282" height="438" fill={IC.shelf} />
        <rect x="82" y="158" width="262" height="418" fill={IC.wall} />
        {/* Shelf boards */}
        {[278, 368, 458, 528].map(y => (
          <rect key={y} x="82" y={y} width="262" height="13" fill={IC.shelf} />
        ))}
        {/* Shelf top */}
        <rect x="72" y="148" width="282" height="14" fill={IC.shelfDark} />
        {/* Books on shelves */}
        {books.length === 0 && (
          <text x="213" y="325" textAnchor="middle" fill={IC.shelfDark}
            style={{ fontFamily: 'Georgia, serif', fontSize: '11px', opacity: 0.4 }}>
            add a book
          </text>
        )}
        {books.slice(0, 12).map((book, i) => {
          const row = Math.floor(i / 4)
          const col = i % 4
          const bx = 88 + col * 64
          const by = [168, 290, 380][row] ?? 168
          const bColor = IC.bookColors[i % IC.bookColors.length]
          return (
            <g key={book._id} className="obj" onClick={() => setSelected(book)}>
              <rect x={bx} y={by} width={56} height={100} fill={bColor} rx="1" />
              <rect x={bx + 2} y={by} width={3} height={100} fill="rgba(0,0,0,0.12)" />
              <rect x={bx + 8} y={by + 10} width={36} height={3} fill="rgba(255,255,255,0.2)" />
            </g>
          )
        })}
        {/* Shelf shadow */}
        <rect x="72" y="148" width="8" height="438" fill={IC.shelfDark} opacity="0.3" />

        {/* ── SOFA (Avery style — flat color, simplified geometry) ── */}
        {/* Sofa back */}
        <rect x="198" y="486" width="428" height="95" fill={IC.sofa} rx="5" />
        <rect x="198" y="482" width="428" height="12" fill={IC.sofaLight} rx="4" />
        {/* Sofa seat */}
        <rect x="204" y="562" width="416" height="52" fill={IC.sofaDark} rx="3" />
        {/* Seat cushion line */}
        <line x1="406" y1="562" x2="406" y2="614" stroke={IC.sofaLight} strokeWidth="2" opacity="0.25" />
        {/* Left arm */}
        <rect x="192" y="504" width="28" height="120" fill={IC.sofaArm} rx="3" />
        <rect x="190" y="500" width="32" height="12" fill={IC.sofaDark} rx="2" />
        {/* Right arm */}
        <rect x="604" y="504" width="28" height="120" fill={IC.sofaArm} rx="3" />
        <rect x="602" y="500" width="32" height="12" fill={IC.sofaDark} rx="2" />
        {/* Sofa legs */}
        <rect x="210" y="614" width="12" height="20" fill={IC.shelfDark} />
        <rect x="402" y="614" width="12" height="20" fill={IC.shelfDark} />
        <rect x="602" y="614" width="12" height="20" fill={IC.shelfDark} />

        {/* ── TV / SCREEN (right side) ── */}
        {/* TV cabinet */}
        <rect x="875" y="588" width="232" height="58" fill={IC.cabinet} rx="3" />
        <polygon points="875,588 899,568 1107,568 1107,588" fill={IC.cabinetDark} opacity="0.4" />
        {/* TV outer frame */}
        <rect x="866" y="442" width="252" height="152" fill={IC.tv} rx="10" />
        {/* Screen */}
        <rect x="879" y="454" width="226" height="128" fill={IC.tvScreen} rx="5" />
        {movies.length > 0 ? (
          <g className="obj" onClick={() => setSelected(movies[0])}>
            <rect x="879" y="454" width="226" height="128" fill={IC.tvOn} rx="5" />
            <text x="992" y="508" textAnchor="middle" fill="white" opacity="0.75"
              style={{ fontFamily: 'Georgia, serif', fontSize: '13px' }}>
              {movies[0].title.slice(0, 22)}
            </text>
            {movies.length > 1 && (
              <text x="992" y="530" textAnchor="middle" fill="white" opacity="0.4"
                style={{ fontFamily: 'Georgia, serif', fontSize: '10px' }}>
                +{movies.length - 1} more
              </text>
            )}
          </g>
        ) : (
          <text x="992" y="522" textAnchor="middle" fill={IC.tvScreen}
            style={{ fontFamily: 'Georgia, serif', fontSize: '11px', opacity: 0.5, filter: 'brightness(1.6)' }}>
            add a movie
          </text>
        )}
        {/* TV stand leg */}
        <rect x="978" y="594" width="24" height="16" fill={IC.tv} />

        {/* ── ARTWORK ON WALL ── */}
        {/* Frame positions */}
        {[
          { x: 378, y: 148, w: 136, h: 170 },
          { x: 536, y: 148, w: 158, h: 170 },
        ].map((pos, i) => {
          const art = artworks[i]
          return (
            <g key={i} className={art ? 'obj' : ''} onClick={art ? () => setSelected(art) : undefined}>
              {/* Frame */}
              <rect x={pos.x} y={pos.y} width={pos.w} height={pos.h} fill={IC.frame} rx="2" />
              {/* Canvas */}
              <rect x={pos.x + 9} y={pos.y + 9} width={pos.w - 18} height={pos.h - 18} fill={IC.canvas} />
              {art ? (
                art.image ? (
                  <image
                    href={urlFor(art.image).width(300).url()}
                    x={pos.x + 9} y={pos.y + 9}
                    width={pos.w - 18} height={pos.h - 18}
                    preserveAspectRatio="xMidYMid slice"
                  />
                ) : (
                  <text x={pos.x + pos.w / 2} y={pos.y + pos.h / 2 + 4}
                    textAnchor="middle" fill={IC.shelfDark}
                    style={{ fontFamily: 'Georgia, serif', fontSize: '11px', opacity: 0.7 }}>
                    {art.title.slice(0, 14)}
                  </text>
                )
              ) : (
                <text x={pos.x + pos.w / 2} y={pos.y + pos.h / 2 + 4}
                  textAnchor="middle" fill={IC.shelfDark}
                  style={{ fontFamily: 'Georgia, serif', fontSize: '10px', opacity: 0.3 }}>
                  artwork
                </text>
              )}
            </g>
          )
        })}

        {/* ── PLANT (left corner) ── */}
        <rect x="148" y="605" width="42" height="50" fill={IC.plantPot} rx="3" />
        <polygon points="148,610 190,610 186,604 152,604" fill={IC.plantDark} opacity="0.25" />
        <ellipse cx="169" cy="578" rx="24" ry="38" fill={IC.plant} transform="rotate(-14, 169, 578)" />
        <ellipse cx="169" cy="578" rx="24" ry="38" fill={IC.plant} transform="rotate(14, 169, 578)" />
        <ellipse cx="169" cy="566" rx="16" ry="28" fill={IC.plantDark} transform="rotate(-4, 169, 566)" />

        {/* ── SIDE TABLE ── */}
        <rect x="638" y="604" width="88" height="12" fill={IC.table} rx="2" />
        <polygon points="638,604 726,604 724,600 640,600" fill={IC.tableDark} opacity="0.4" />
        <rect x="648" y="616" width="10" height="32" fill={IC.tableDark} />
        <rect x="706" y="616" width="10" height="32" fill={IC.tableDark} />
        {/* Mug on table */}
        <rect x="672" y="590" width="24" height="16" fill={IC.mug} rx="2" />
        <path d="M 696 593 Q 706 593 706 601 Q 706 609 696 609" fill="none" stroke={IC.mug} strokeWidth="3" strokeLinecap="round" />

        {/* ── EXIT DOOR (right side wall) ── */}
        <g className="obj" onClick={onExit} style={{ cursor: 'pointer' }}>
          <rect x="1048" y="368" width="112" height="292" fill={IC.doorFrame} />
          <rect x="1058" y="378" width="92" height="274" fill={IC.door} />
          <circle cx="1066" cy="515" r="6" fill={IC.shelf} />
          <path d="M 1058 378 Q 1104 355 1150 378" fill={IC.wallSide} opacity="0.3" />
          <text x="1104" y="668" textAnchor="middle" fill={IC.floorPlank}
            style={{ fontFamily: 'Georgia, serif', fontSize: '11px', opacity: 0.5, letterSpacing: '2px' }}>
            outside
          </text>
        </g>

        {/* ── ROOM LABEL ── */}
        <text x="600" y="96" textAnchor="middle" fill={IC.shelfDark}
          style={{ fontFamily: 'Georgia, serif', fontSize: '14px', opacity: 0.35, letterSpacing: '6px' }}>
          MY WORLD
        </text>

        {/* Loading indicator */}
        {loading && (
          <text x="600" y="400" textAnchor="middle" fill={IC.shelfDark}
            style={{ fontFamily: 'Georgia, serif', fontSize: '13px', opacity: 0.4, letterSpacing: '3px' }}>
            ...
          </text>
        )}
      </svg>

      {/* ── ENTRY DETAIL PANEL ── */}
      {selected && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(60, 40, 20, 0.42)',
            backdropFilter: 'blur(3px)',
          }}
          onClick={() => setSelected(null)}
        >
          <div
            style={{
              backgroundColor: '#F0E8D8',
              maxWidth: '520px',
              width: '88%',
              padding: '2.8rem 3rem',
              borderRadius: '2px',
              fontFamily: 'Georgia, serif',
              boxShadow: '0 12px 48px rgba(0,0,0,0.25)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <p style={{
              color: '#A07850',
              fontSize: '10px',
              letterSpacing: '4px',
              marginBottom: '10px',
              textTransform: 'uppercase',
            }}>
              {selected.entryType}
            </p>
            <h2 style={{
              color: '#3A2818',
              fontSize: '26px',
              marginBottom: '14px',
              lineHeight: 1.25,
              fontWeight: 'normal',
            }}>
              {selected.title}
            </h2>
            {selected.image && (
              <img
                src={urlFor(selected.image).width(460).url()}
                alt={selected.title}
                style={{
                  width: '100%',
                  height: '220px',
                  objectFit: 'cover',
                  marginBottom: '16px',
                  borderRadius: '1px',
                }}
              />
            )}
            {selected.description && (
              <p style={{
                color: '#5A4030',
                fontSize: '15px',
                lineHeight: 1.75,
                whiteSpace: 'pre-wrap',
              }}>
                {selected.description}
              </p>
            )}
            {selected.date && (
              <p style={{ color: '#A08060', fontSize: '12px', marginTop: '18px', letterSpacing: '1px' }}>
                {selected.date}
              </p>
            )}
            {selected.tags && selected.tags.length > 0 && (
              <div style={{ marginTop: '14px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {selected.tags.map(tag => (
                  <span key={tag} style={{
                    color: '#A07850',
                    fontSize: '10px',
                    letterSpacing: '2px',
                    border: '1px solid #C0A878',
                    padding: '2px 10px',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <button
              onClick={() => setSelected(null)}
              style={{
                marginTop: '24px',
                background: 'none',
                border: 'none',
                color: '#A07850',
                fontSize: '11px',
                letterSpacing: '3px',
                cursor: 'pointer',
                padding: '0',
                textTransform: 'uppercase',
              }}
            >
              close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
